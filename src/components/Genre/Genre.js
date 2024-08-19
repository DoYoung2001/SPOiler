import React, { useEffect, useState } from "react";
import BookmarkButton from "../BookmarkButton/BookmarkButton";
import axios from "axios";
import TrackInfo from "../TrackInfo/TrackInfo";
import styles from "./Genre.module.css";

const SpotifyGenreTracks = () => {
  const [token, setToken] = useState("");
  const [popularTracks, setPopularTracks] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const genre = "k-pop";

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
    const loadPopularTracks = async () => {
      if (token) {
        try {
          const response = await axios.get(
            `https://api.spotify.com/v1/search?q=genre:${genre}&type=track&limit=20`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const tracksWithPopularity = response.data.tracks.items.filter(
            (track) => track.popularity > 50
          );
          setPopularTracks(tracksWithPopularity);
        } catch (error) {
          console.error("Error fetching popular tracks:", error);
        }
      }
    };

    loadPopularTracks();
  }, [token]);

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

  return (
    <div className={styles["track-pop"]}>
      <p className={styles.title}>TOP 20 : {genre}</p>
      <div className={styles["track-grid"]}>
        {popularTracks.map((track, index) => (
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
              <h3 className={styles["track-title"]}>
                {index + 1}. {track.name}
              </h3>
              <p className={styles["track-artist"]}>
                {track.artists.map((artist) => artist.name).join(", ")}
              </p>
            </div>
            <div
              className={styles.bookmarkButtonContainer}
              onClick={(e) => e.stopPropagation()} // 상위 요소의 클릭 이벤트 전파 차단
            >
              <BookmarkButton key={track.id} />
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

export default SpotifyGenreTracks;
