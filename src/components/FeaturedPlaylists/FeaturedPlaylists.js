import React, { useEffect, useState } from "react";
import axios from "axios";
import BookmarkButton from "../BookmarkButton/BookmarkButton"; // BookmarkButton 추가
import TrackInfo from "../TrackInfo/TrackInfo";
import styles from './FeaturedPlaylists.module.css';

const FeaturedPlaylists = () => {
  const [token, setToken] = useState('');
  const [playlists, setPlaylists] = useState([]);
  const [tracks, setTracks] = useState({});
  const [expandedPlaylist, setExpandedPlaylist] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookmarkedTracks, setBookmarkedTracks] = useState(new Set()); // 북마크된 트랙 상태 추가

  useEffect(() => {
    const getToken = async () => {
      try {
        const response = await axios.post('https://accounts.spotify.com/api/token',
          'grant_type=client_credentials',
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': 'Basic ' + btoa(process.env.REACT_APP_SPOTIFY_CLIENT_ID + ':' + process.env.REACT_APP_SPOTIFY_CLIENT_SECRET),
            },
          }
        );
        setToken(response.data.access_token);
      } catch (error) {
        console.error('Error fetching the token:', error.response ? error.response.data : error.message);
      }
    };

    getToken();
  }, []);

  useEffect(() => {
    if (token) {
      const fetchFeaturedPlaylists = async () => {
        try {
          const response = await axios.get('https://api.spotify.com/v1/browse/featured-playlists', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setPlaylists(response.data.playlists.items);
        } catch (error) {
          console.error('Error fetching featured playlists:', error);
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
    if (expandedPlaylist === playlistId) {
      setExpandedPlaylist(null);
    } else {
      setExpandedPlaylist(playlistId);
      fetchTracks(playlistId);
    }
  };

  const handleTrackClick = async (e, trackId) => {
    e.stopPropagation(); // 이벤트 전파를 막아 상위 요소에 영향을 주지 않음
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
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching track details:", error);
    }
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
    <div className={styles.featuredPlaylists}>
      <p className={styles.title}>실시간 인기 플레이리스트</p>
      <div className={styles.playlistsGrid}>
        {playlists.map((playlist) => (
          <div key={playlist.id} className={`${styles.playlistCard} ${expandedPlaylist === playlist.id ? styles.expanded : ''}`} onClick={() => handlePlaylistClick(playlist.id)}>
            <div className={`${styles.playlistHeader} ${expandedPlaylist === playlist.id ? styles.expanded : ''}`}>
              <img src={playlist.images[0]?.url} alt={playlist.name} className={`${styles.playlistImage} ${expandedPlaylist === playlist.id ? styles.expanded : ''}`} />
              <div className={styles.playlistInfo}>
                <h3 className={`${styles.playlistTitle} ${expandedPlaylist === playlist.id ? styles.expanded : ''}`}>{playlist.name}</h3>
                <p className={`${styles.playlistDescription} ${expandedPlaylist === playlist.id ? styles.expanded : ''}`}>
                  {expandedPlaylist === playlist.id ? playlist.description : `${playlist.description.substring(0, 50)}...`}
                </p>
              </div>
            </div>
            <div className={`${styles.tracksList} ${expandedPlaylist === playlist.id ? styles.expanded : ''}`}>
              {tracks[playlist.id] && tracks[playlist.id].map((trackItem) => {
                if (!trackItem || !trackItem.track) return null;

                return (
                  <div key={trackItem.track.id} className={styles.trackItem} onClick={(e) => handleTrackClick(e, trackItem.track.id)}>
                    <img 
                      src={trackItem.track.album?.images?.[0]?.url || 'default-image-url.jpg'} 
                      alt={trackItem.track.name || 'Track'} 
                      className={styles.trackImage} 
                    />
                    <div className={styles.trackInfo}>
                      <p className={styles.trackName}>{trackItem.track.name || 'Unknown Track'}</p>
                      <p className={styles.artistName}>
                        {trackItem.track.artists ? trackItem.track.artists.map(artist => artist.name).join(', ') : 'Unknown Artist'}
                      </p>
                    </div>
                    <div className={styles.bookmarkButtonContainer} onClick={(e) => e.stopPropagation()}>
                      <BookmarkButton
                        id={trackItem.track.id}
                        isBookmarked={bookmarkedTracks.has(trackItem.track.id)}
                        onToggle={() => handleBookmarkToggle(trackItem.track.id)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <TrackInfo
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        track={selectedTrack}
      />
    </div>
  );
};

export default FeaturedPlaylists;