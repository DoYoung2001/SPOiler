import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import BookmarkButton from "../BookmarkButton/BookmarkButton";
import TrackInfo from "../TrackInfo/TrackInfo";
import styles from "./NewReleases.module.css";

const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;

const NewReleases = () => {
  const [token, setToken] = useState("");
  const [newReleases, setNewReleases] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);

  const trackListRef = useRef(null);

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

  const handleAlbumClick = async (albumId) => {
    if (selectedAlbum && selectedAlbum.id === albumId) {
      setSelectedAlbum(null);
      setTracks([]);
    } else {
      try {
        const tracksResponse = await axios.get(
          `https://api.spotify.com/v1/albums/${albumId}/tracks`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSelectedAlbum({ id: albumId });
        setTracks(tracksResponse.data.items);
      } catch (error) {
        console.error("Error fetching album tracks:", error);
      }
    }
  };

  const handleTrackClick = async (trackId) => {
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

  const closeTrackModal = () => {
    setIsTrackModalOpen(false);
    setSelectedTrack(null);
  };

  return (
    <div className={styles.newReleases}>
      <p className={styles.title}>최신 음악</p>
      <div className={styles.releasesGrid}>
        {newReleases.map((album) => (
          <React.Fragment key={album.id}>
            <div
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
            </div>
            {selectedAlbum && selectedAlbum.id === album.id && (
              <div className={styles.trackList} ref={trackListRef}>
                <h3>Tracks</h3>
                <ul>
                  {tracks.map((track) => (
                    <li 
                      key={track.id}
                      onClick={() => handleTrackClick(track.id)}
                    >
                      {track.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      <TrackInfo
        isOpen={isTrackModalOpen}
        onClose={closeTrackModal}
        track={selectedTrack}
      />
    </div>
  );
};

export default NewReleases;