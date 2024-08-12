// src/App.js
import React, { useState } from "react";
import "./styles/App.css";
import Header from "./components/Header";
import Login from "./components/Login";
import Register from "./components/Register";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import "./styles.css";

const App = () =>{
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleRegisterClick = () => {
    setIsRegistering(true);
  };

  const handleRegisterSubmit = () => {
    setIsRegistering(false); // Go back to login after successful registration
  };

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
    <Header onLogout={handleLogout}/>
    <div className="main-layout">
      <Sidebar />
      <MainContent />
    </div>
  </div>
);
};
export default App;
