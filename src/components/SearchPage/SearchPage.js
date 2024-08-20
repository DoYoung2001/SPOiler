// SearchPage.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom'; // useLocation 훅 가져오기
import styles from './SearchPage.module.css';

const SearchPage = () => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation(); // 현재 위치 정보 가져오기

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('query');

    if (query) {
      const fetchTracks = async () => {
        setLoading(true);
        try {
          const token = localStorage.getItem('token'); // LocalStorage에서 토큰 가져오기
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
  }, [location.search]); // 의존성 배열에 location.search 추가

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching tracks: {error.message}</div>;

  return (
    <div className={styles.resultsContainer}>
      <h2>Search Results</h2>
      <ul>
        {tracks.map((track) => (
          <li key={track.id} className={styles.trackItem}>
            <img src={track.album.images[0]?.url} alt={track.name} className={styles.trackImage} />
            <div className={styles.trackInfo}>
              <div>{track.name}</div>
              <div>{track.artists.map(artist => artist.name).join(', ')}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchPage;