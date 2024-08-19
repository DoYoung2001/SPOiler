import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./PlaylistDetail.module.css";

const PlaylistDetail = () => {
  const { playlistName } = useParams(); // URL에서 playlistName을 가져옵니다
  const [tracks, setTracks] = useState([]); // 트랙리스트 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(""); // 에러 상태
  const userId = 1; // 예시로 사용자의 ID를 하드코딩. 실제로는 로그인된 사용자 정보를 통해 얻어야 함

  useEffect(() => {
    const fetchTracks = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token"); // JWT 토큰을 로컬 스토리지에서 가져옴

        if (!token) {
          throw new Error("JWT Token not found. Please login again.");
        }

        const response = await axios.get(
          `http://localhost:8080/api/tracklist?userId=${userId}`, // 트랙리스트 조회 API
          {
            headers: {
              Authorization: `Bearer ${token}`, // 인증 헤더에 JWT 토큰 포함
            },
          }
        );

        setTracks(response.data); // 트랙리스트를 상태에 저장
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching tracks:", error);
        setError("Failed to fetch tracks. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, [userId]);

  const handleDelete = async (spotifyId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("JWT Token not found. Please login again.");
      }

      const response = await axios.delete(
        `http://localhost:8080/api/tracklist/${spotifyId}`, // 트랙 삭제 API
        {
          headers: {
            Authorization: `Bearer ${token}`, // 인증 헤더에 JWT 토큰 포함
          },
        }
      );

      if (response.status === 200) {
        setTracks((prevTracks) =>
          prevTracks.filter((track) => track.spotifyId !== spotifyId)
        ); // 상태에서 트랙 삭제
        // 남은 트랙 리스트를 콘솔에 출력
        console.log("Remaining tracks after deletion:", setTracks);

        alert(response.data); // 성공 메시지 표시
      } else {
        throw new Error("Failed to delete track. Please try again later.");
      }
    } catch (error) {
      console.error("Error deleting track:", error);
      setError("Failed to delete track. Please try again later.");
    }
  };

  return (
    <div className={styles.playlistDetailContainer}>
      <div className={styles.playlistDetailHeader}>
        <h1>플레이리스트: {playlistName}</h1>
      </div>
      <div className={styles.playlistDetailBox}>
        {tracks.length > 0 ? (
          <div className={styles.tracksList}>
            {tracks.map((track) => (
              <div key={track.id} className={styles.trackItem}>
                <img
                  src={track.imageUrl || "default-image-url.jpg"}
                  alt={track.name}
                  className={styles.trackImage}
                />
                <div className={styles.trackInfo}>
                  <p className={styles.trackName}>{track.name}</p>
                  <p className={styles.artistName}>{track.artist}</p>
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
