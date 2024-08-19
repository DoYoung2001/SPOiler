import React, { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import MainContent from "./components/MainContent/MainContent";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Playlist from "./components/Playlist/Playlist";
import PlaylistDetail from "./components/PlaylistDetail/PlaylistDetail";
import "./styles.css";

const queryClient = new QueryClient();

// 로그인 상태와 회원가입 상태를 App 컴포넌트에서 관리
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token")); // 로컬 스토리지에서 로그인 상태 확인
  const [location, setLocation] = useState({ lat: null, lon: null });
  const navigate = useNavigate(); // useNavigate 훅 사용

  useEffect(() => {
    if (isLoggedIn) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          // 에러 시 기본 위치를 설정할 수 있습니다 (예: 서울)
          setLocation({ lat: 37.52193056, lon: 129.1166333 });
        }
      );
    }
  }, [isLoggedIn]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate("/"); // 로그인 후 메인 페이지로 이동
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("token"); // 로그아웃 시 토큰 삭제
    navigate("/login"); // 로그아웃 후 로그인 페이지로 이동
  };

  const handleRegisterClick = () => {
    navigate("/register"); // 회원가입 페이지로 이동
  };

  const handleRegisterSubmit = () => {
    navigate("/login"); // 회원가입 후 로그인 페이지로 이동
  };

  if (!isLoggedIn) {
    return (
      <Routes>
        <Route
          path="/login"
          element={
            <Login
              onLogin={handleLogin}
              onRegisterClick={handleRegisterClick}
            />
          }
        />
        <Route
          path="/register"
          element={<Register onSubmit={handleRegisterSubmit} />}
        />
        <Route
          path="*"
          element={
            <Login
              onLogin={handleLogin}
              onRegisterClick={handleRegisterClick}
            />
          }
        />{" "}
        {/* 기본 경로 설정 */}
      </Routes>
    );
  }

  return (
    <div className="app">
      <Header onLogout={handleLogout} />
      <QueryClientProvider client={queryClient}>
        <div className="main-layout">
          <div className="sidebar">
            <Sidebar lat={location.lat} lon={location.lon} />
          </div>
          <div className="playlist-container">
            <Routes>
              <Route path="/" element={<MainContent lat={location.lat} lon={location.lon} />} />
              <Route path="/playlist" element={<Playlist />} />
              <Route
                path="/playlist/:playlistName"
                element={<PlaylistDetail />}
              />
              {/* 로그인 페이지는 이미 처리됨 */}
            </Routes>
          </div>
        </div>
      </QueryClientProvider>
    </div>
  );
};

// Router로 래핑된 App 컴포넌트 반환
const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
