import React from "react";
import FeaturedPlaylists from "../FeaturedPlaylists/FeaturedPlaylists";
import styles from "./MainContent.module.css";
import NewReleases from "../NewReleases";
import SpotifyGenreTracks from "../Genre/Genre";

const MainContent = () => (
  <main className={styles["main-content"]}>
    <div className={styles["content-grid"]}>
      <div className={styles["content-box"]}>
        <div>
          <NewReleases />
        </div>
      </div>
      <div className={styles["content-box"]}>
        <div>
          <FeaturedPlaylists />
        </div>
      </div>
      <div className={styles["content-box"]}>
        <div>
          <SpotifyGenreTracks />
        </div>
      </div>
      <div className={styles["content-box"]}>
        <p className={styles["content-box"] + " " + styles["title"]}>추천 재생목록</p>
        <div>{/* 추천 재생목록 내용 추가 */}</div>
      </div>
    </div>
  </main>
);

export default MainContent;
