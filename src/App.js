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

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate("/"); // 로그인 후 메인 페이지로 이동
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate("/login"); // 로그아웃 후 로그인 페이지로 이동
  };

  const handleRegisterClick = () => {
    setIsRegistering(true);
 

  };

  const handleRegisterSubmit = () => {
    setIsRegistering(false);
     navigate("/login"); // 회원가입 후 로그인 페이지로 이동
  };

  // 로그인 여부와 등록 상태에 따라 화면을 다르게 표시
  if (!isLoggedIn) {
    if (isRegistering) {
      return <Register onSubmit={handleRegisterSubmit} />;
    } else {
      return (
        <Login onLogin={handleLogin} onRegisterClick={handleRegisterClick} />
      );
    }
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
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
      </div>
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
