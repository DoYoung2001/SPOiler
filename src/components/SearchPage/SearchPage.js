import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import styles from './SearchPage.module.css';
import BookmarkButton from "../BookmarkButton/BookmarkButton";


const SearchPage = () => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [bookmarkedTracks, setBookmarkedTracks] = useState(new Set());
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('query');

    if (query) {
      const fetchTracks = async () => {
        setLoading(true);
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(
            `https://api.spotify.com/v1/search?q=${query}&type=track&limit=15`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setTracks(response.data.tracks.items);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      };
      fetchTracks();
    }
  }, [location.search]);


  useEffect(() => {
    const fetchInitialBookmarks = async () => {
      const userToken = localStorage.getItem("token");
      if (userToken) {
        try {
          const response = await axios.get("http://localhost:8080/api/tracklist", {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          });
          const bookmarkedIds = new Set(response.data.map(track => track.spotifyId));
          setBookmarkedTracks(bookmarkedIds);
        } catch (error) {
          console.error("Error fetching initial bookmarks:", error);
        }
      }
    };

    fetchInitialBookmarks();
  }, []);

  const toggleBookmark = (trackId) => {
    setBookmarkedTracks((prevBookmarks) => {
      const newBookmarks = new Set(prevBookmarks);
      if (newBookmarks.has(trackId)) {
        newBookmarks.delete(trackId);
      } else {
        newBookmarks.add(trackId);
      }
      return newBookmarks;
    });
  };

  const handleTrackClick = (track) => {
    setSelectedTrack(track);
  };

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching tracks: {error.message}</div>;

  return (
    <div className={styles.resultsContainer}>
      <div className={styles.trackList}>
        <h2 className={styles.searchResultsHeader}>Search Results</h2>
        <div className={styles.trackHeaders}>
          <span className={styles.bookmark}></span> {/* 북마크 버튼을 위한 빈 헤더 */}
          <span className={styles.index}>#</span>
          <span className={styles.trackName}>Track Name</span>
          <span className={styles.albumName}>Album Name</span>
          <span className={styles.duration}>Duration</span>
        </div>
        <ul>
          {tracks.map((track, index) => (
            <li key={track.id} className={styles.trackItem} onClick={() => handleTrackClick(track)}>
              <div
                className={styles.bookmarkButtonContainer}
                onClick={(e) => e.stopPropagation()}
              >
                <BookmarkButton
                  trackId={track.id}
                  initialBookmarked={bookmarkedTracks.has(track.id)}
                  onToggle={() => toggleBookmark(track.id)}
                />
              </div>
              <span className={styles.trackIndex}>{index + 1}</span>
              <img src={track.album.images[0]?.url} alt={track.name} className={styles.trackImage} />
              <div className={styles.trackInfo}>
                <div>{track.name}</div>
                <div className={styles.albumName}>{track.album.name}</div>
              </div>
              <span className={styles.trackDuration}>{formatDuration(track.duration_ms)}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.trackInfoContainer}>
        {selectedTrack ? (
          <div className={styles.trackDetails}>
            <h2 className={styles.trackTitle}>{selectedTrack.name}</h2>
            {selectedTrack.album.images[0] && (
              <img src={selectedTrack.album.images[0].url} alt={selectedTrack.name} className={styles.trackInfoImage} />
            )}
            <p>Artist: {selectedTrack.artists.map((artist) => artist.name).join(", ")}</p>
            <p>Album: {selectedTrack.album.name}</p>
            <p>Release Date: {selectedTrack.album.release_date}</p>
            <p>Duration: {formatDuration(selectedTrack.duration_ms)}</p>
            <p>Popularity: {selectedTrack.popularity}</p>
            <p>Track Number: {selectedTrack.track_number}</p>
            <p>Explicit: {selectedTrack.explicit ? "Yes" : "No"}</p>
            {selectedTrack.preview_url && (
              <audio controls>
                <source src={selectedTrack.preview_url} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            )}
            <div>
              <a
                href={selectedTrack.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
              >
                Listen on Spotify
              </a>
            </div>
          </div>
        ) : (
          <div className={styles.emptyState}>Select a track to see details</div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;