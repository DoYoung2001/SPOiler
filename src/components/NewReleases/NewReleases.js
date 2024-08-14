// -- useEffect와 토큰 받아오기:

//    컴포넌트가 처음 렌더링될 때 useEffect가 실행되어 Spotify API로부터 액세스 토큰을 받아옵니다.
//    토큰을 요청할 때, 클라이언트 ID와 시크릿을 Base64로 인코딩하여 헤더에 포함시킵니다.
//    받아온 토큰은 상태 변수 token에 저장됩니다.

// -- useEffect와 신곡 리스트 받아오기:

//    토큰이 성공적으로 받아졌을 때, 다시 useEffect가 실행되어 Spotify API로부터 신곡 리스트 데이터를 요청합니다.
//    받아온 신곡 리스트 데이터는 상태 변수 newReleases에 저장되며, 컴포넌트에서 이를 활용해 렌더링을 수행합니다.

import React, { useEffect, useState } from "react";
import axios from "axios";
import BookmarkButton from "../BookmarkButton/BookmarkButton";
import AlbumInfo from "../AlbumInfo/AlbumInfo";
import styles from "./NewReleases.module.css";

// 클라이언트 ID와 시크릿을 환경 변수에서 가져옴 ( .env 파일 )
const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;

const NewReleases = () => {
  // 토큰과 신곡 데이터를 저장할 상태 변수 선언
  const [token, setToken] = useState("");
  const [newReleases, setNewReleases] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // 비동기적으로 Spotify API 토큰을 받아오는 함수
    const getToken = async () => {
      try {
        // Spotify API에 클라이언트 자격 증명으로 토큰 요청
        const response = await axios.post(
          "https://accounts.spotify.com/api/token",
          "grant_type=client_credentials", // 클라이언트 자격 증명 흐름을 사용하여 토큰 요청
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: "Basic " + btoa(CLIENT_ID + ":" + CLIENT_SECRET),
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

    getToken(); // 토큰 받아오는 함수 호출
  }, []); // 빈 배열을 두 번째 인자로 전달하여 컴포넌트가 처음 렌더링될 때만 실행되도록 설정

  // 토큰이 변경될 때마다 실행되는 useEffect 훅
  useEffect(() => {
    // 비동기적으로 신곡 리스트를 받아오는 함수
    const fetchNewReleases = async () => {
      if (token) {
        // 토큰이 설정된 경우에만 실행
        try {
          // Spotify API를 통해 신곡 리스트 데이터 요청
          const response = await axios.get(
            "https://api.spotify.com/v1/browse/new-releases",
            {
              headers: {
                Authorization: `Bearer ${token}`, // Bearer 토큰을 Authorization 헤더에 포함
              },
            }
          );
          setNewReleases(response.data.albums.items); // 받아온 신곡 리스트 데이터를 상태에 저장
        } catch (error) {
          // 에러 발생 시 콘솔에 에러 로그 출력
          console.error("Error fetching new releases:", error);
        }
      }
    };

    fetchNewReleases(); // 신곡 리스트 받아오는 함수 호출
  }, [token]); // 토큰이 변경될 때마다 실행

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
    <div className={styles.newReleases}>
      <p className={styles.title}>최신 음악</p>
      <div className={styles.releasesGrid}>
        {newReleases.map((album) => (
          <div
            key={album.id}
            className={styles.releaseCard}
            onClick={() => handleAlbumClick(album.id)} // 앨범 클릭 시 상세 정보 요청
          >
            <img
              src={album.images[0].url}
              alt={album.name}
              className={styles.releaseImage}
            />
            <div className={styles.releaseInfo}>
              <h3 className={styles.releaseTitle}>{album.name}</h3>
              <BookmarkButton />
              <p className={styles.releaseArtist}>
                {album.artists.map((artist) => artist.name).join(", ")}
              </p>
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
