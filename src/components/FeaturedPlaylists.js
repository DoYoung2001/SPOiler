// src/components/FeaturedPlaylists.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './FeaturedPlaylists.css';

const FeaturedPlaylists = () => {
  const [token, setToken] = useState('');
  const [playlists, setPlaylists] = useState([]);

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

  return (
    <div className="featured-playlists">
      <h2>실시간 인기 플레이리스트</h2>
      <div className="playlists-grid">
        {playlists.map((playlist) => (
          <div key={playlist.id} className="playlist-card">
            <img src={playlist.images[0].url} alt={playlist.name} className="playlist-image" />
            <div className="playlist-info">
              <h3 className="playlist-title">{playlist.name}</h3>
              <p className="playlist-description">{playlist.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedPlaylists;
