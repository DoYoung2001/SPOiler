import React from "react";
import FeaturedPlaylists from "./FeaturedPlaylists/FeaturedPlaylists";
import NewReleases from './NewReleases';
import SpotifyGenreTracks from './Genre';

const MainContent = () => (
  <main className="main-content">
    <div className="content-grid">
          <div className="content-box">
            <div>
              <NewReleases />
            </div>
          </div>
          <div className="content-box">
            <div>
              <FeaturedPlaylists />
            </div>
          </div>
          <div className="content-box">
            <div>
              <SpotifyGenreTracks />
            </div>
          </div>
          <div className="content-box">
            <p className="title">추천 재생목록</p>
            <div>
              {/* 추천 재생목록 내용 추가 */}
            </div>
          </div>
        </div>
  </main>
);

export default MainContent;
