import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/NewReleases.css';
import BookmarkButton from './BookmarkButton';

const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;

const NewReleases = () => {
  const [token, setToken] = useState("");
  const [newReleases, setNewReleases] = useState([]);
  

  useEffect(() => {
    // Spotify API 토큰을 요청하는 함수
    const getToken = async () => {
      try {
        const response = await axios.post(
          "https://accounts.spotify.com/api/token",
          "grant_type=client_credentials",
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: "Basic " + btoa(CLIENT_ID + ":" + CLIENT_SECRET),
            },
          }
        );
        setToken(response.data.access_token); // 토큰 설정
      } catch (error) {
        console.error(
          "Error fetching the token:",
          error.response ? error.response.data : error.message
        );
      }
    };

    getToken(); // 토큰을 가져오는 함수 호출
  }, []);

  useEffect(() => {
    // 토큰이 설정되었을 때 신곡 리스트를 가져오는 함수
    const fetchNewReleases = async () => {
      if (token) {
        try {
          const response = await axios.get(
            "https://api.spotify.com/v1/browse/new-releases",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setNewReleases(response.data.albums.items); // 신곡 리스트 설정
        } catch (error) {
          console.error("Error fetching new releases:", error);
        }
      }
    };

    fetchNewReleases(); // 신곡 리스트 가져오는 함수 호출
  }, [token]);

  return (
    <div className="new-releases">
      <p className="title">신곡 리스트</p>
      <div className="releases-grid">
        {newReleases.map((album) => (
          <div key={album.id} className="release-card">
            <img
              src={album.images[0].url}
              alt={album.name}
              className="release-image"
            />
            <div className="release-info">
              <h3 className="release-title">{album.name}</h3>
              <BookmarkButton />
              <p className="release-artist">
                {album.artists.map((artist) => artist.name).join(", ")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewReleases;
