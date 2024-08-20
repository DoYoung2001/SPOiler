import React, { useEffect, useState } from "react";
import axios from "axios";
import BookmarkButton from "../BookmarkButton/BookmarkButton";
import TrackInfo from "../TrackInfo/TrackInfo";
import styles from "./NewReleases.module.css";

const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;
const PLAYLIST_ID = "37i9dQZF1DXe5W6diBL5N4"; // New Music K-Pop 플레이리스트 ID

const KpopNewReleases = () => {
  const [token, setToken] = useState("");
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [bookmarkedTracks, setBookmarkedTracks] = useState(new Set());

  useEffect(() => {
    const getToken = async () => {
      try {
        const response = await axios.post(
          "https://accounts.spotify.com/api/token",
          "grant_type=client_credentials",
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: "Basic " + btoa(CLIENT_ID + ":" + CLIENT_SECRET),
            },
          }
        );
        setToken(response.data.access_token);
      } catch (error) {
        console.error("Error fetching the token:", error);
      }
    };

    getToken();
  }, []);

  useEffect(() => {
    const fetchPlaylistTracks = async () => {
      if (token) {
        try {
          const response = await axios.get(
            `https://api.spotify.com/v1/playlists/${PLAYLIST_ID}/tracks?limit=30`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setPlaylistTracks(response.data.items.map(item => item.track));
        } catch (error) {
          console.error("Error fetching playlist tracks:", error);
        }
      }
    };

    fetchPlaylistTracks();
  }, [token]);

  useEffect(() => {
    // 초기 북마크 상태를 가져오는 함수
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

  const handleTrackInfo = async (trackId) => {
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
      setIsTrackModalOpen(true);
    } catch (error) {
      console.error("Error fetching track details:", error);
    }
  };

  const closeTrackModal = () => {
    setIsTrackModalOpen(false);
    setSelectedTrack(null);
  };

  return (
    <div className={styles.newReleases}>
      <p className={styles.title}>New Music K-Pop (국내 최신 가요)</p>
      <div className={styles.releasesGrid}>
        {playlistTracks.map((track) => (
          <div
            key={track.id}
            className={styles.releaseCard}
            onClick={() => handleTrackInfo(track.id)}
          >
            <div className={styles.releaseHeader}>
              <img
                src={track.album.images[0].url}
                alt={track.name}
                className={styles.releaseImage}
              />
              <div className={styles.releaseInfo}>
                <h3 className={styles.releaseTitle}>{track.name}</h3>
                <p className={styles.releaseArtist}>
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
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <TrackInfo
        isOpen={isTrackModalOpen}
        onClose={closeTrackModal}
        track={selectedTrack}
      />
    </div>
  );
};

export default KpopNewReleases;