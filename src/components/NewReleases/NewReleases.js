import React, { useEffect, useState } from "react";
import axios from "axios";
import BookmarkButton from "../BookmarkButton/BookmarkButton";
import AlbumInfo from "../AlbumInfo/AlbumInfo";
import TrackInfo from "../TrackInfo/TrackInfo"; // TrackInfo 추가
import styles from "./NewReleases.module.css";

const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;

const NewReleases = () => {
  const [token, setToken] = useState("");
  const [newReleases, setNewReleases] = useState([]);
  const [expandedAlbum, setExpandedAlbum] = useState(null);
  const [tracks, setTracks] = useState({});
  const [bookmarkedTracks, setBookmarkedTracks] = useState(new Set());
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);

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
        console.error("Error fetching the token:", error);
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
      setIsAlbumModalOpen(true);
    } catch (error) {
      console.error("Error fetching album details:", error);
    }
  };

  const handleTrackClick = async (e, trackId) => {
    e.stopPropagation(); // 이벤트 전파 방지
    try {
      const response = await axios.get(
        `https://api.spotify.com/v1/tracks/${trackId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSelectedTrack(response.data);
      setIsTrackModalOpen(true);
    } catch (error) {
      console.error("Error fetching track details:", error);
    }
  };

  const closeAlbumModal = () => {
    setIsAlbumModalOpen(false);
    setSelectedAlbum(null);
  };

  const closeTrackModal = () => {
    setIsTrackModalOpen(false);
    setSelectedTrack(null);
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
            className={`${styles.releaseCard} ${
              expandedAlbum === album.id ? styles.expanded : ""
            }`}
            onClick={() => handleAlbumClick(album.id)}
          >
            <div className={styles.releaseHeader}>
              <img
                src={album.images[0].url}
                alt={album.name}
                className={styles.releaseImage}
              />
              <div className={styles.releaseInfo}>
                <div className={styles.titleContainer}>
                  <h3 className={styles.releaseTitle}>{album.name}</h3>
                  <button
                    className={styles.moreButton}
                    onClick={(e) => handleInfoClick(e, album.id)}
                  >
                    ...
                  </button>
                </div>
                <p className={styles.releaseArtist}>
                  {album.artists.map((artist) => artist.name).join(", ")}
                </p>
              </div>
            </div>
            {expandedAlbum === album.id && (
              <div className={`${styles.tracksList} ${styles.expanded}`}>
                {tracks[album.id] &&
                  tracks[album.id].map((track) => (
                    <div
                      key={track.id}
                      className={styles.trackItem}
                      onClick={(e) => handleTrackClick(e, track.id)}
                    >
                      <img
                        src={
                          track.album?.images?.[0]?.url ||
                          "default-image-url.jpg"
                        }
                        alt={track.name}
                        className={styles.trackImage}
                      />
                      <div className={styles.trackInfo}>
                        <p className={styles.trackName}>{track.name}</p>
                        <p className={styles.artistName}>
                          {track.artists
                            .map((artist) => artist.name)
                            .join(", ")}
                        </p>
                      </div>
                      <div
                        className={styles.bookmarkButtonContainer}
                        onClick={(e) => e.stopPropagation()}
                      >
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
        isOpen={isAlbumModalOpen}
        onClose={closeAlbumModal}
        album={selectedAlbum}
      />
      <TrackInfo
        isOpen={isTrackModalOpen}
        onClose={closeTrackModal}
        track={selectedTrack}
      />
    </div>
  );
};

export default NewReleases;