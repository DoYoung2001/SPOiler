import React, { useState } from "react";
import TracklistAlert from "../TracklistAlert/TracklistAlert"; // 모달 컴포넌트 임포트
import styles from "./Sidebar.module.css";
import { useNavigate, useLocation } from "react-router-dom"; // useNavigate 훅 임포트
import { useWeather } from "../../hooks/useWeather";
import Lottie from "react-lottie";
import clearAnimation from "./animations/clear.json"; // 맑은 날씨 애니메이션
import rainAnimation from "./animations/rain.json";
import cloudsAnimation from "./animations/clouds.json";
import snowAnimation from "./animations/snow.json";

import axios from "axios";

const Sidebar = ({ lat, lon }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const navigate = useNavigate(); // useNavigate 훅 사용
  const { data } = useWeather(lat, lon);
  const location = useLocation();

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDeleteClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      // 로컬 스토리지에서 토큰을 가져옴
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("JWT Token not found. Please login again.");
      }

      // 전체 트랙 삭제 API 호출
      const response = await axios.delete(
        "http://localhost:8080/api/tracklist/clear",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("모든 트랙이 삭제되었습니다.");
        setShowConfirmDialog(false);
          // 현재 위치에 따라 다른 페이지로 이동
          if (location.pathname === "/") {
            navigate("/myplaylist");
          } else {
            navigate("/");
          }
      } else {
        throw new Error("Failed to delete tracks. Please try again later.");
      }
    } catch (error) {
      console.error("Error deleting tracks:", error);
      alert("트랙 삭제에 실패했습니다. 나중에 다시 시도해 주세요.");
      setShowConfirmDialog(false);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmDialog(false);
  };

  const handleHomeClick = () => {
    navigate("/"); // 루트 경로로 이동
  };

  // 내 플레이리스트 클릭 시 호출될 함수
  const goToPlaylist = () => {
    navigate("/myplaylist"); // 플레이리스트 페이지로 이동
  };

  // 날씨 애니메이션 선택
  const getWeatherAnimation = (weatherType) => {
    switch (weatherType) {
      case "Clear":
        return clearAnimation;
      case "Rain":
        return rainAnimation;
      case "Clouds":
        return cloudsAnimation;
      case "Snow":
        return snowAnimation;
      default:
        return null;
    }
  };

  const animationData = data ? getWeatherAnimation(data.weather[0].main) : null;

  const weatherAnimationOptions = {
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarItem} onClick={handleHomeClick}>
        {/* 홈 클릭 시 handleHomeClick 호출 */}
        <div className={styles.icon}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24px"
            height="24px"
            fill="currentColor"
            viewBox="0 0 256 256"
          >
            <path d="M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.53,0,1.14,1.14,0,0,0,.11.11l80,75.48A16,16,0,0,1,224,115.55Z" />
          </svg>
        </div>
        <span className={styles.name}>홈</span>
      </div>
      <div className={styles.sidebarItem} onClick={goToPlaylist}>
        <div className={styles.icon}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24px"
            height="24px"
            fill="currentColor"
            viewBox="0 0 256 256"
          >
            <path d="M32,64a8,8,0,0,1,8-8H216a8,8,0,0,1,0,16H40A8,8,0,0,1,32,64Zm8,72H160a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16Zm72,48H40a8,8,0,0,0,0,16h72a8,8,0,0,0,0-16Zm135.66-57.7a8,8,0,0,1-10,5.36L208,122.75V192a32.05,32.05,0,1,1-16-27.69V112a8,8,0,0,1,10.3-7.66l40,12A8,8,0,0,1,247.66,126.3ZM192,192a16,16,0,1,0-16,16A16,16,0,0,0,192,192Z" />
          </svg>
        </div>
        <span className={styles.name}>내 플레이리스트</span>
      </div>
      <TracklistAlert
        isOpen={isModalOpen}
        onClose={closeModal}
        onPlaylistAdded={() => {}} // handlePlaylistAdded 제거
      />
      {!data ? null : (
        <div className={styles.weatherAnimationContainer}>
          <Lottie
            options={weatherAnimationOptions}
            height={150}
            width={150}
            className={styles.lottieAnimation}
          />
          <div className={styles.weatherDetails}>
            <div className={styles.locationName}>{data.name}</div>{" "}
            <div>{data.weather[0].description}</div>
            <div>{Math.round(data.main.temp)}°C</div>
            <div>{data.wind.speed} m/s</div>
          </div>
        </div>
      )}

      <div className={styles.sidebarDelete}>
        <button className={styles.deleteButton} onClick={handleDeleteClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24px"
            height="24px"
            fill="currentColor"
            viewBox="0 0 256 256"
          >
            <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z" />
          </svg>
          전체 트랙 삭제
        </button>
      </div>
      {showConfirmDialog && (
        <div className={styles.confirmDialogOverlay}>
          <div className={styles.confirmDialog}>
            <p className={styles.cancelText}>모든 트랙을 삭제하시겠습니까?</p>
            <div className={styles.confirmDialogButtons}>
              <button onClick={handleConfirmDelete}>확인</button>
              <button onClick={handleCancelDelete}>취소</button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
