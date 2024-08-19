import React from "react";
import FeaturedPlaylists from "../FeaturedPlaylists/FeaturedPlaylists";
import styles from "./MainContent.module.css";
import NewReleases from "../NewReleases/NewReleases";
import SpotifyGenreTracks from "../Genre/Genre";
import WeatherBasedRecommendations from "../WeatherBasedRecommendations/WeatherBasedRecommendations";
import { useWeather } from "../../hooks/useWeather";

const MainContent = ({ lat, lon }) => {
  const { data } = useWeather(lat, lon);

  return (
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
          {data ? <WeatherBasedRecommendations weather={data.weather[0].main} /> : "날씨 정보를 불러오는 중..."}
        </div>
      </div>
    </main>
  );
};

export default MainContent;
