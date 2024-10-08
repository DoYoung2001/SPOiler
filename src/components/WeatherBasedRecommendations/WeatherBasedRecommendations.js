import React, { useEffect, useState } from "react";
import axios from "axios";
import BookmarkButton from "../BookmarkButton/BookmarkButton";
import TrackInfo from "../TrackInfo/TrackInfo";
import styles from "./WeatherBasedRecommendations.module.css";

const WeatherBasedRecommendations = ({ weather }) => {
  const [token, setToken] = useState("");
  const [recommendedTracks, setRecommendedTracks] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookmarkedTracks, setBookmarkedTracks] = useState(new Set());

  useEffect(() => {
    const getAccessToken = async () => {
      const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
      const clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;
      try {
        const response = await axios.post(
          "https://accounts.spotify.com/api/token",
          "grant_type=client_credentials",
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
            },
          }
        );
        setToken(response.data.access_token);
      } catch (error) {
        console.error(
          "Error fetching the token:",
          error.response ? error.response.data : error.message
        );
      }
    };
    getAccessToken();
  }, []);

  useEffect(() => {
    const fetchInitialBookmarks = async () => {
      const userToken = localStorage.getItem("token");
      if (userToken) {
        try {
          const response = await axios.get("http://localhost:8080/api/tracklist", {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          });
          const bookmarkedIds = new Set(response.data.map(track => track.spotifyId));
          setBookmarkedTracks(bookmarkedIds);
        } catch (error) {
          console.error("Error fetching initial bookmarks:", error);
        }
      }
    };

    fetchInitialBookmarks();
  }, []);

  useEffect(() => {
    const fetchRecommendedTracks = async () => {
      if (token && weather) {
        try {
          const weatherCondition = getWeatherCondition(weather);
          const response = await axios.get(
            `https://api.spotify.com/v1/search?q=genre:${weatherCondition}&type=track&limit=40`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const tracksWithPopularity = response.data.tracks.items.filter(
            (track) => track.popularity > 30
          );
          setRecommendedTracks(tracksWithPopularity);
        } catch (error) {
          console.error("Error fetching recommended tracks:", error);
        }
      }
    };

    fetchRecommendedTracks();
  }, [token, weather]);

  const getWeatherCondition = (weather) => {
    switch (weather) {
      case "Clear":
        return "rock";
      case "Clouds":
        return "mellow";
      case "Snow":
        return "cozy";
      case "Rain":
        return "relax";
      default:
        return "pop";
    }
  };

  const getTitle = (weather) => {
    switch (weather) {
      case "Clear":
        return "맑은 날씨에 어울리는 pop";
      case "Clouds":
        return "흐린 날씨에 어울리는 pop";
      case "Snow":
        return "눈 내리는 날에 어울리는 pop";
      case "Rain":
        return "비 오는 날에 어울리는 pop";
      default:
        return "날씨에 어울리는 pop";
    }
  };

  const handleTrackClick = async (trackId) => {
    try {
      const response = await axios.get(
        `https://api.spotify.com/v1/tracks/${trackId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSelectedTrack(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching track details:", error);
    }
  };

  const toggleBookmark = (trackId) => {
    setBookmarkedTracks((prevBookmarks) => {
      const newBookmarks = new Set(prevBookmarks);
      if (newBookmarks.has(trackId)) {
        newBookmarks.delete(trackId);
      } else {
        newBookmarks.add(trackId);
      }
      return newBookmarks;
    });
  };

  return (
    <div className={styles["track-pop"]}>
      <p className={styles["title"]}>{getTitle(weather)}</p>
      <div className={styles["track-grid"]}>
        {recommendedTracks.map((track) => (
          <div
            key={track.id}
            className={styles["track-card"]}
            onClick={() => handleTrackClick(track.id)}
          >
            {track.album.images.length > 0 && (
              <img
                src={track.album.images[0].url}
                alt={track.name}
                className={styles["track-image"]}
              />
            )}
            <div className={styles["track-info"]}>
              <h3 className={styles["track-title"]}>{track.name}</h3>
              <p className={styles["track-artist"]}>
                {track.artists.map((artist) => artist.name).join(", ")}
              </p>
            </div>
            <div
              className={styles.bookmarkButtonContainer}
              onClick={(e) => e.stopPropagation()}
            >
              <BookmarkButton
                trackId={track.id}
                initialBookmarked={bookmarkedTracks.has(track.id)}
                onToggle={() => toggleBookmark(track.id)}
              />
            </div>
          </div>
        ))}
      </div>
      <TrackInfo
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        track={selectedTrack}
      />
    </div>
  );
};

export default WeatherBasedRecommendations;
