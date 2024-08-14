import React from "react";
import { useParams } from "react-router-dom";
import styles from "./PlaylistDetail.module.css"; // CSS 모듈 파일을 import합니다

const PlaylistDetail = () => {
  const { playlistName } = useParams(); // URL에서 playlistName을 가져옵니다

  return (
    <div className={styles.playlistDetailContainer}>
      <div className={styles.playlistDetailHeader}>
        <h1>플레이리스트: {playlistName}</h1>
      </div>
      <div className={styles.playlistDetailBox}>
        <p>여기에 플레이리스트의 곡이나 추가 정보를 표시합니다.</p>
        {/* 실제 플레이리스트 항목을 여기에 추가 */}
        <ul>
          <li>곡 1</li>
          <li>곡 2</li>
          <li>곡 3</li>
        </ul>
      </div>
    </div>
  );
};

export default PlaylistDetail;
