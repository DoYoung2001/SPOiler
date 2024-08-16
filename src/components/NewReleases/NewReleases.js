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
  const [expandedAlbum, setExpandedAlbum] = useState(null);
  const [tracks, setTracks] = useState({});
  const [bookmarkedTracks, setBookmarkedTracks] = useState(new Set());

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

  const fetchTracks = async (albumId) => {
    try {
      const response = await axios.get(
        `https://api.spotify.com/v1/albums/${albumId}/tracks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const trackDetails = await Promise.all(
        response.data.items.map(async (track) => {
          const trackResponse = await axios.get(
            `https://api.spotify.com/v1/tracks/${track.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          return trackResponse.data;
        })
      );
      setTracks((prevTracks) => ({
        ...prevTracks,
        [albumId]: trackDetails,
      }));
    } catch (error) {
      console.error("Error fetching tracks:", error);
    }
  };

  const handleAlbumClick = (albumId) => {
    if (expandedAlbum === albumId) {
      setExpandedAlbum(null);
    } else {
      setExpandedAlbum(albumId);
      fetchTracks(albumId);
    }
  };

  const handleInfoClick = (e, albumId) => {
    e.stopPropagation(); // 이벤트 전파 방지
    handleAlbumInfo(albumId);
  };

  const handleAlbumInfo = async (albumId) => {
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

  const handleBookmarkToggle = (trackId) => {
    setBookmarkedTracks((prevBookmarkedTracks) => {
      const updatedBookmarkedTracks = new Set(prevBookmarkedTracks);
      if (updatedBookmarkedTracks.has(trackId)) {
        updatedBookmarkedTracks.delete(trackId);
      } else {
        updatedBookmarkedTracks.add(trackId);
      }
      return updatedBookmarkedTracks;
    });
  };

  return (
    <div className={styles.newReleases}>
      <p className={styles.title}>최신 음악</p>
      <div className={styles.releasesGrid}>
        {newReleases.map((album) => (
          <div
            key={album.id}
            className={`${styles.releaseCard} ${expandedAlbum === album.id ? styles.expanded : ''}`}
            onClick={() => handleAlbumClick(album.id)}
          >
            <div className={styles.releaseHeader}>
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
              <div className={styles.buttonContainer}>
                <button onClick={(e) => handleInfoClick(e, album.id)}>...</button>
              </div>
            </div>
            {expandedAlbum === album.id && (
              <div className={`${styles.tracksList} ${styles.expanded}`}>
                {tracks[album.id] && tracks[album.id].map((track) => (
                  <div key={track.id} className={styles.trackItem}>
                    <img
                      src={track.album?.images?.[0]?.url || 'default-image-url.jpg'}
                      alt={track.name}
                      className={styles.trackImage}
                    />
                    <div className={styles.trackInfo}>
                      <p className={styles.trackName}>{track.name}</p>
                      <p className={styles.artistName}>
                        {track.artists.map((artist) => artist.name).join(", ")}
                      </p>
                    </div>
                    <div className={styles.bookmarkButtonContainer} onClick={(e) => e.stopPropagation()}>
                      <BookmarkButton
                        key={track.id}
                        isBookmarked={bookmarkedTracks.has(track.id)}
                        onToggle={() => handleBookmarkToggle(track.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
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