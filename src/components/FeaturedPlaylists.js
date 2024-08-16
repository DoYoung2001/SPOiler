import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BookmarkButton from './BookmarkButton';
import '../styles/FeaturedPlaylists.css';

const FeaturedPlaylists = () => {
  const [token, setToken] = useState('');
  const [playlists, setPlaylists] = useState([]);
  const [tracks, setTracks] = useState({}); // 각 플레이리스트의 트랙 정보를 저장할 상태
  const [expandedPlaylist, setExpandedPlaylist] = useState(null); // 확장된 플레이리스트를 저장할 상태

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
      setExpandedPlaylist(null); // 이미 확장된 경우 다시 클릭하면 축소
    } else {
      setExpandedPlaylist(playlistId); // 클릭한 플레이리스트를 확장
      fetchTracks(playlistId); // 트랙을 가져옵니다.
    }
  };

  return (
    <div className="featured-playlists">
      <p className="title">실시간 인기 플레이리스트</p>
      <div className="playlists-grid">
        {playlists.map((playlist) => (
          <div key={playlist.id} className={`playlist-card ${expandedPlaylist === playlist.id ? 'expanded' : ''}`} onClick={() => handlePlaylistClick(playlist.id)}>
            <div className={`playlist-header ${expandedPlaylist === playlist.id ? 'expanded' : ''}`}>
              <img src={playlist.images[0].url} alt={playlist.name} className={`playlist-image ${expandedPlaylist === playlist.id ? 'expanded' : ''}`} />
              <div className="playlist-info">
                <h3 className={`playlist-title ${expandedPlaylist === playlist.id ? 'expanded' : ''}`}>{playlist.name}</h3>
                <BookmarkButton />
                <p className={`playlist-description ${expandedPlaylist === playlist.id ? 'expanded' : ''}`}>
                  {expandedPlaylist === playlist.id ? playlist.description : `${playlist.description.substring(0, 50)}...`}
                </p>
              </div>
            </div>
            <div className={`tracks-list ${expandedPlaylist === playlist.id ? 'expanded' : ''}`}>
              {tracks[playlist.id] && tracks[playlist.id].map((trackItem) => (
                <div key={trackItem.track.id} className="track-item">
                  <img src={trackItem.track.album.images[0]?.url} alt={trackItem.track.name} className="track-image" />
                  <div className="track-info">
                    <p className="track-name">{trackItem.track.name}</p>
                    <p className="artist-name">{trackItem.track.artists.map(artist => artist.name).join(', ')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedPlaylists;