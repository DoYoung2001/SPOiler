import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import Login from "./components/Login";
import Register from "./components/Register";
import Playlist from "./components/Playlist";
import PlaylistDetail from "./components/PlaylistDetail";
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
  };

  const handleRegisterClick = () => {
    setIsRegistering(true);
  };

  const handleRegisterSubmit = () => {
    setIsRegistering(false);
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
        <Sidebar />
        <Routes>
          <Route path="/" element={<MainContent />} />
          <Route path="/playlist" element={<Playlist />} />
          <Route path="/playlist/:playlistName" element={<PlaylistDetail />} />
        </Routes>
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
