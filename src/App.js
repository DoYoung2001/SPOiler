import React, { useState } from "react";
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

// 로그인 상태와 회원가입 상태를 App 컴포넌트에서 관리
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token')); // 로컬 스토리지에서 로그인 상태 확인
  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate("/"); // 로그인 후 메인 페이지로 이동
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('token'); // 로그아웃 시 토큰 삭제
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
        <Route path="/login" element={<Login onLogin={handleLogin} onRegisterClick={handleRegisterClick} />} />
        <Route path="/register" element={<Register onSubmit={handleRegisterSubmit} />} />
        <Route path="*" element={<Login onLogin={handleLogin} onRegisterClick={handleRegisterClick} />} /> {/* 기본 경로 설정 */}
      </Routes>
    );
  }

  return (
    <div className="app">
      <Header onLogout={handleLogout} />
      <div className="main-layout">
        <div className="sidebar">
          <Sidebar />
        </div>
        <div className="playlist-container">
          <Routes>
            <Route path="/" element={<MainContent />} />
            <Route path="/playlist" element={<Playlist />} />
            <Route path="/playlist/:playlistName" element={<PlaylistDetail />} />
            {/* 로그인 페이지는 이미 처리됨 */}
          </Routes>
        </div>
      </div>
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
