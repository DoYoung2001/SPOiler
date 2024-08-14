import React from "react";
import styles from "./Playlist.module.css"; // CSS 모듈 파일을 불러옵니다

const Playlist = () => {
  return (
    <div className={styles.playlistContainer}>
      <h1 className={styles.title}>내 플레이리스트</h1>
      <div className={styles.playlistBox}>{/* 플레이리스트 아이템 추가 */}</div>
    </div>
  );
};

export default Playlist;
