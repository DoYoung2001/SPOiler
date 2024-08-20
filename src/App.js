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
import SearchPage from "./components/SearchPage/SearchPage"; // SearchPage 컴포넌트 가져오기
import "./styles.css";

const queryClient = new QueryClient();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [location, setLocation] = useState({ lat: null, lon: null });
  const navigate = useNavigate();

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
          setLocation({ lat: 34.6937378, lon: 135.5021651 });
        }
      );
    }
  }, [isLoggedIn]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate("/");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  const handleRegisterSubmit = () => {
    navigate("/login");
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
        />
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
              <Route
                path="/"
                element={<MainContent lat={location.lat} lon={location.lon} />}
              />
              <Route path="/playlist" element={<Playlist />} />
              <Route path="/myplaylist" element={<PlaylistDetail />} />
              <Route path="/search" element={<SearchPage />} />{" "}
              {/* SearchPage 라우트 추가 */}
            </Routes>
          </div>
        </div>
      </QueryClientProvider>
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
