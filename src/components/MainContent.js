import React from "react";
import FeaturedPlaylists from "./FeaturedPlaylists";
import "../styles/MainContent.css";
import NewReleases from "./NewReleases/NewReleases"; // 경로를 수정
import SpotifyGenreTracks from "./Genre";

const MainContent = () => (
  <main className="main-content">
    <div className="content-grid">
      <div className="content-box">
        <NewReleases />
      </div>
      <div className="content-box">
        <FeaturedPlaylists />
      </div>
      <div className="content-box">
        <SpotifyGenreTracks />
      </div>
      <div className="content-box">
        <p className="title">추천 재생목록</p>
        <div>{/* 추천 재생목록 내용 추가 */}</div>
      </div>
    </div>
  </main>
);

export default MainContent;
