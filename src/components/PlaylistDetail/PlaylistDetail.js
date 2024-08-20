import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./PlaylistDetail.module.css";

const PlaylistDetail = () => {
  const { playlistName } = useParams();
  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTracks = async () => {
      setIsLoading(true);
      setError("");

      try {
        const localToken = localStorage.getItem("token");
        if (!localToken) {
          throw new Error("JWT Token not found. Please login again.");
        }

        // 서버에서 저장된 트랙리스트를 가져옴
        const tracklistResponse = await axios.get(
          `http://localhost:8080/api/tracklist`,
          {
            headers: {
              Authorization: `Bearer ${localToken}`,
            },
          }
        );

        const savedTracks = tracklistResponse.data;

        if (savedTracks.length === 0) {
          setTracks([]);
          setIsLoading(false);
          return;
        }

        // Spotify API 토큰 가져오기
        const tokenResponse = await axios.post(
          "https://accounts.spotify.com/api/token",
          "grant_type=client_credentials",
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization:
                "Basic " +
                btoa(
                  process.env.REACT_APP_SPOTIFY_CLIENT_ID +
                    ":" +
                    process.env.REACT_APP_SPOTIFY_CLIENT_SECRET
                ),
            },
          }
        );

        const spotifyToken = tokenResponse.data.access_token;

        // Spotify API를 통해 트랙의 세부 정보를 가져옴
        const trackDetailsPromises = savedTracks.map((track) =>
          axios.get(`https://api.spotify.com/v1/tracks/${track.spotifyId}`, {
            headers: {
              Authorization: `Bearer ${spotifyToken}`,
            },
          })
        );

        const trackDetailsResponses = await Promise.all(trackDetailsPromises);
        const spotifyTracks = trackDetailsResponses.map((res) => res.data);

        setTracks(spotifyTracks);
      } catch (error) {
        console.error("Error fetching tracks:", error);
        setError("Failed to fetch tracks. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTracks();
  }, []);

  const handleDelete = async (spotifyId) => {
    try {
      const localToken = localStorage.getItem("token");
      if (!localToken) {
        throw new Error("JWT Token not found. Please login again.");
      }

      const response = await axios.delete(
        `http://localhost:8080/api/tracklist/${spotifyId}`,
        {
          headers: {
            Authorization: `Bearer ${localToken}`,
          },
        }
      );

      if (response.status === 200) {
        setTracks((prevTracks) =>
          prevTracks.filter((track) => track.id !== spotifyId)
        );
        alert(response.data);

        // 모든 트랙이 삭제된 경우 홈으로 이동
        if (tracks.length === 1) {
          navigate("/");
        }
      } else {
        throw new Error("Failed to delete track. Please try again later.");
      }
    } catch (error) {
      console.error("Error deleting track:", error);
      setError("Failed to delete track. Please try again later.");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.playlistDetailContainer}>
      <div className={styles.playlistDetailHeader}>
        <h1>플레이리스트: {playlistName}</h1>
      </div>
      <div className={styles.playlistDetailBox}>
        {error ? (
          <p>{error}</p>
        ) : tracks.length > 0 ? (
          <div className={styles.tracksList}>
            {tracks.map((track) => (
              <div key={track.id} className={styles.trackItem}>
                <img
                  src={track.album.images[0]?.url || "default-image-url.jpg"}
                  alt={track.name}
                  className={styles.trackImage}
                />
                <div className={styles.trackInfo}>
                  <p className={styles.trackName}>{track.name}</p>
                  <p className={styles.artistName}>
                    {track.artists.map((artist) => artist.name).join(", ")}
                  </p>
                </div>
                <div className={styles.deleteButtonContainer}>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDelete(track.id)}
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>플레이리스트에 곡이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default PlaylistDetail;