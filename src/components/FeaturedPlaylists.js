// - useEffect와 토큰 받아오기:

//   컴포넌트가 처음 렌더링될 때 useEffect가 실행되어 Spotify API로부터 액세스 토큰을 받아옵니다.
//   토큰을 요청할 때, 클라이언트 ID와 시크릿을 Base64로 인코딩하여 헤더에 포함시킵니다.
//   받아온 토큰은 상태 변수 token에 저장됩니다.

// - useEffect와 피처드 플레이리스트 받아오기:

//   토큰이 성공적으로 받아졌을 때, 다시 useEffect가 실행되어 Spotify API로부터 피처드 플레이리스트 데이터를 요청합니다.
//   받아온 플레이리스트 데이터는 상태 변수 playlists에 저장되며, 컴포넌트에서 이를 활용해 렌더링을 수행합니다.

// src/components/FeaturedPlaylists.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import BookmarkButton from "./BookmarkButton";
import "../styles/FeaturedPlaylists.css";

const FeaturedPlaylists = () => {
  // 토큰과 플레이리스트 데이터를 저장할 상태 변수 선언
  const [token, setToken] = useState("");
  const [playlists, setPlaylists] = useState([]);

  // 컴포넌트가 처음 렌더링될 때 실행되는 useEffect 훅
  useEffect(() => {
    // 비동기적으로 토큰을 받아오는 함수
    const getToken = async () => {
      try {
        // Spotify API에 클라이언트 자격 증명으로 토큰 요청
        const response = await axios.post(
          "https://accounts.spotify.com/api/token",
          "grant_type=client_credentials", // 클라이언트 자격 증명 흐름을 사용하여 토큰 요청
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization:
                "Basic " +
                btoa(
                  process.env.REACT_APP_SPOTIFY_CLIENT_ID +
                    ":" +
                    process.env.REACT_APP_SPOTIFY_CLIENT_SECRET
                ),
              // 클라이언트 ID와 클라이언트 시크릿을 Base64로 인코딩하여 Authorization 헤더에 포함
            },
          }
        );
        // 받아온 액세스 토큰을 상태에 저장
        setToken(response.data.access_token);
      } catch (error) {
        // 에러 발생 시 콘솔에 에러 로그 출력
        console.error(
          "Error fetching the token:",
          error.response ? error.response.data : error.message
        );
      }
    };

    // 토큰 받아오는 함수 호출
    getToken();
  }, []); // 빈 배열을 두 번째 인자로 전달하여 컴포넌트가 처음 렌더링될 때만 실행되도록 설정

  // 토큰이 변경될 때마다 실행되는 useEffect 훅
  useEffect(() => {
    // 토큰이 존재할 경우에만 API 요청 실행
    if (token) {
      // 비동기적으로 피처드 플레이리스트를 받아오는 함수
      const fetchFeaturedPlaylists = async () => {
        try {
          // Spotify API를 통해 피처드 플레이리스트 데이터 요청
          const response = await axios.get(
            "https://api.spotify.com/v1/browse/featured-playlists",
            {
              headers: {
                Authorization: `Bearer ${token}`, // Bearer 토큰을 Authorization 헤더에 포함
              },
            }
          );
          // 받아온 플레이리스트 데이터를 상태에 저장
          setPlaylists(response.data.playlists.items);
        } catch (error) {
          // 에러 발생 시 콘솔에 에러 로그 출력
          console.error("Error fetching featured playlists:", error);
        }
      };

      // 피처드 플레이리스트 받아오는 함수 호출
      fetchFeaturedPlaylists();
    }
  }, [token]); // 토큰이 변경될 때마다 실행

  return (
    <div className="featured-playlists">
      <p className="title">스포티파이 뮤직PD 앨범</p>
      <div className="playlists-grid">
        {playlists.map((playlist) => (
          <div key={playlist.id} className="playlist-card">
            <img
              src={playlist.images[0].url}
              alt={playlist.name}
              className="playlist-image"
            />
            <div className="playlist-info">
              <h3 className="playlist-title">{playlist.name}</h3>
              <BookmarkButton />
              <p className="playlist-description">{playlist.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedPlaylists;
