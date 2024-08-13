// src/App.js
import React, { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import Login from "./components/Login";
import Register from "./components/Register";
import "./styles.css";

const App = () => {
  // 로그인 상태와 등록 상태를 관리하는 상태 변수
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // 로그인 처리 함수
  const handleLogin = () => {
    setIsLoggedIn(true); // 로그인 시 isLoggedIn을 true로 설정
  };

  // 로그아웃 처리 함수
  const handleLogout = () => {
    setIsLoggedIn(false); // 로그아웃 시 isLoggedIn을 false로 설정
  };

  // 등록 화면으로 전환하는 함수
  const handleRegisterClick = () => {
    setIsRegistering(true);
  };

  // 등록 완료 후 로그인 화면으로 돌아오는 함수
  const handleRegisterSubmit = () => {
    setIsRegistering(false);
  };

  // 로그인 여부와 등록 상태에 따라 화면을 다르게 표시
  if (!isLoggedIn) {
    if (isRegistering) {
      // 등록 페이지 렌더링
      return <Register onSubmit={handleRegisterSubmit} />;
    } else {
      // 로그인 페이지 렌더링
      return (
        <Login onLogin={handleLogin} onRegisterClick={handleRegisterClick} />
      );
    }
  }

  // 로그인 후에는 Header, Sidebar, MainContent를 표시
  return (
    <div className="app">
      <Header onLogout={handleLogout} />
      <div className="main-layout">
        <Sidebar />
        <MainContent />
      </div>
    </div>
  );
};

export default App;
