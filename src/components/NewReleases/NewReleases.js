import React, { useEffect, useState } from "react";
import axios from "axios";
import BookmarkButton from "../BookmarkButton/BookmarkButton";
import AlbumInfo from "../AlbumInfo/AlbumInfo";
import styles from "./NewReleases.module.css";

const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;

const NewReleases = () => {
  const [token, setToken] = useState("");
  const [newReleases, setNewReleases] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
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
        setToken(response.data.access_token);
      } catch (error) {
        console.error(
          "Error fetching the token:",
          error.response ? error.response.data : error.message
        );
      }
    };

    getToken();
  }, []);

  useEffect(() => {
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
          setNewReleases(response.data.albums.items);
        } catch (error) {
          console.error("Error fetching new releases:", error);
        }
      }
    };

    fetchNewReleases();
  }, [token]);

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
      setSelectedAlbum(response.data);
      setIsModalOpen(true);
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
            onClick={() => handleAlbumClick(album.id)}
          >
            <img
              src={album.images[0].url}
              alt={album.name}
              className={styles.releaseImage}
            />
            <div className={styles.releaseInfo}>
              <h3 className={styles.releaseTitle}>{album.name}</h3>
              <p className={styles.releaseArtist}>
                {album.artists.map((artist) => artist.name).join(", ")}
              </p>
            </div>
            <div
              className={styles.bookmarkButtonContainer}
              onClick={(e) => e.stopPropagation()} // 상위 요소의 클릭 이벤트 전파 차단
            >
              <BookmarkButton id={album.id} />
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