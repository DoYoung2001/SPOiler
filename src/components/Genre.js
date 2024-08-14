import React, { useEffect, useState } from 'react';
import BookmarkButton from './BookmarkButton';
import '../styles/Genre.css';
import axios from 'axios';

const SpotifyGenreTracks = () => {
  const [token, setToken] = useState('');
  const [popularTracks, setPopularTracks] = useState([]);
    const genre = 'k-pop'; // 원하는 장르를 설정하세요.

    useEffect(() => {
    const getAccessToken = async () => {
        const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID; // 본인의 클라이언트 ID
        const clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET; // 본인의 클라이언트 비밀 키
        try {
          const response = await axios.post('https://accounts.spotify.com/api/token',
            'grant_type=client_credentials',
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret),
              },
            }
          );
          setToken(response.data.access_token); // 토큰 설정
        } catch (error) {
          console.error('Error fetching the token:', error.response ? error.response.data : error.message);
        }
    };
    getAccessToken(); 
  }, []);


    useEffect(() => {
        const loadPopularTracks  = async () => {
          if (token) {
            try {
              const response = await axios.get(`https://api.spotify.com/v1/search?q=genre:${genre}&type=track&limit=20`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              // 인기 트랙의 popularity 정보를 필터링
          const tracksWithPopularity = response.data.tracks.items.filter(track => track.popularity > 50); // 인기 기준 설정
          setPopularTracks(tracksWithPopularity);
            } catch (error) {
              console.error('Error fetching  popular tracks:', error);
            }
          }
        };
    
        loadPopularTracks (); 
      }, [token]);
    

    return  (
        <div className="track-pop">
          <p className='title'> TOP 20 : {genre}</p>
          <div className="track-grid">
            {popularTracks.map((track, index) => (
              <div key={track.id} className="track-card">
               {track.album.images.length > 0 && (
              <img src={track.album.images[0].url} alt={track.name} className="track-image" />
            )}
                <div className="track-info">
                  <h3 className="track-title">{index + 1}. {track.name}</h3>
                  <BookmarkButton /> 
                  <p className="track-artist">{track.artists.map(artist => artist.name).join(', ')}</p>
                
                </div>
              </div>
            ))}
          </div>
        </div>
      );
};

export default SpotifyGenreTracks;
