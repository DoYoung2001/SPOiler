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
  const [tracks, setTracks] = useState({}); // 각 플레이리스트의 트랙 정보를 저장할 상태

  useEffect(() => {
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
        setToken(response.data.access_token);
      } catch (error) {
        // 에러 발생 시 콘솔에 에러 로그 출력
        console.error(
          "Error fetching the token:",
          error.response ? error.response.data : error.message
        );
      }
    };

    getToken();
  }, []);

  useEffect(() => {
    if (token) {
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

      fetchFeaturedPlaylists();
    }
  }, [token]);

  const fetchTracks = async (playlistId) => {
    try {
      const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTracks((prevTracks) => ({
        ...prevTracks,
        [playlistId]: response.data.items,
      }));
    } catch (error) {
      console.error('Error fetching tracks:', error);
    }
  };

  const handlePlaylistClick = (playlistId) => {
    if (!tracks[playlistId]) {
      fetchTracks(playlistId);
    } else {
      setTracks((prevTracks) => ({
        ...prevTracks,
        [playlistId]: null,
      }));
    }
  };

  return (
    <div className="featured-playlists">
      <p className="title">스포티파이 뮤직PD 앨범</p>
      <div className="playlists-grid">
        {playlists.map((playlist) => (
          <div key={playlist.id} className="playlist-card" onClick={() => handlePlaylistClick(playlist.id)}>
            <div className="playlist-header">
              <img src={playlist.images[0].url} alt={playlist.name} className="playlist-image" />
              <div className="playlist-info">
                <h3 className="playlist-title">{playlist.name}</h3>
                <BookmarkButton />
                <p className="playlist-description">{playlist.description}</p>
              </div>
            </div>
            <div className={`tracks-list ${tracks[playlist.id] ? 'expanded' : ''}`}>
              {tracks[playlist.id] && tracks[playlist.id].map((trackItem) => (
                <div key={trackItem.track.id} className="track-item">
                  <img src={trackItem.track.album.images[0]?.url} alt={trackItem.track.name} className="track-image" />
                  <div className="track-info">
                    <p className="track-name">{trackItem.track.name}</p>
                    <p className="artist-name">{trackItem.track.artists.map(artist => artist.name).join(', ')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedPlaylists;
