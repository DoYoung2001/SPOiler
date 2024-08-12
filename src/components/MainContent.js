import React from "react";
import FeaturedPlaylists from "./FeaturedPlaylists";
import './MainContent.css';
import NewReleases from './NewReleases';

const MainContent = () => (
  <main className="main-content">
    <h1>최근 업데이트된 콘텐츠</h1>
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
            <h2>최근 재생</h2>
            <div>
              {/* 최근 재생 내용 추가 */}
            </div>
          </div>
          <div className="content-box">
            <h2>추천 재생목록</h2>
            <div>
              {/* 추천 재생목록 내용 추가 */}
            </div>
          </div>
        </div>
  </main>
);

export default MainContent;
