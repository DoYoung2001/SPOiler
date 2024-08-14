import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/NewReleases.css";
import BookmarkButton from "./BookmarkButton";
import AlbumInfo from "./AlbumInfo";

const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;

const NewReleases = () => {
  const [token, setToken] = useState("");
  const [newReleases, setNewReleases] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // 앨범 클릭 시 해당 앨범의 상세 정보를 가져오는 함수
  const handleAlbumClick = async (albumId) => {
    try {
      const response = await axios.get(
        `https://api.spotify.com/v1/albums/${albumId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSelectedAlbum(response.data); // 앨범의 상세 정보를 상태에 저장
      setIsModalOpen(true); // 모달 열기
    } catch (error) {
      console.error("Error fetching album details:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAlbum(null);
  };

  return (
    <div className="new-releases">
      <p className="title">최신 음악</p>
      <div className="releases-grid">
        {newReleases.map((album) => (
          <div
            key={album.id}
            className="release-card"
            onClick={() => handleAlbumClick(album.id)} // 앨범 클릭 시 상세 정보 요청
          >
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
              {/* 버튼 클릭으로 상세 정보를 가져옴 */}
              <button
                className="Infobutton"
                onClick={() => handleAlbumClick(album.id)}
              >
                앨범 상세보기
              </button>
            </div>
          </div>
        ))}
      </div>
      <AlbumInfo
        isOpen={isModalOpen}
        onClose={closeModal}
        album={selectedAlbum}
      />
    </div>
  );
};

export default NewReleases;
