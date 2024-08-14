import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../styles.css'; // styles.css 파일 경로

const Header = ({ onLogout }) => {
  const [token, setToken] = useState('');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [toggleStates, setToggleStates] = useState({}); // 토글 상태를 저장할 객체
  const trackRefs = useRef({}); // 트랙 정보의 참조를 저장할 객체

  useEffect(() => {
    const getToken = async () => {
      const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
      const clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;
      const authString = `${clientId}:${clientSecret}`;
      const authBase64 = btoa(authString);

      try {
        const response = await axios.post(
          'https://accounts.spotify.com/api/token',
          'grant_type=client_credentials',
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Authorization: `Basic ${authBase64}`,
            }
          }
        );
        setToken(response.data.access_token);
      } catch (error) {
        console.error('Error fetching Spotify token', error);
      }
    };

    getToken();
  }, []);

  const handleSearch = async (e) => {
    setQuery(e.target.value);
    if (e.target.value && token) {
      try {
        const response = await axios.get(
          `https://api.spotify.com/v1/search?q=${e.target.value}&type=track&limit=5`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        );
        setResults(response.data.tracks.items);
      } catch (error) {
        console.error('Error fetching search results', error);
      }
    } else {
      setResults([]);
    }
  };

  const toggleButton = (trackId) => {
    setToggleStates((prevStates) => {
      const newState = !prevStates[trackId];
      alert(`Track ${newState ? 'bookmarked' : 'unbookmarked'}`);
      return {
        ...prevStates,
        [trackId]: newState,
      };
    });
  };

  // 폰트 크기 조정 함수
  const adjustFontSize = (element) => {
    if (element.scrollWidth > element.clientWidth) {
      element.style.fontSize = '0.8em';
    } else {
      element.style.fontSize = '1em';
    }
  };

  useEffect(() => {
    results.forEach((result) => {
      if (trackRefs.current[result.id]) {
        adjustFontSize(trackRefs.current[result.id].trackName);
        adjustFontSize(trackRefs.current[result.id].artistName);
      }
    });
  }, [results]);

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"
              fill="currentColor"
            />
          </svg>
          <h2>SPOiler</h2>
        </div>
        <nav className="header-nav"></nav>
      </div>
      <div className="header-right">
        <label className="search">
          <input
            placeholder="Search"
            value={query}
            onChange={handleSearch}
          />
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="8" stroke="green" strokeWidth="2" />
            <line x1="16" y1="16" x2="22" y2="22" stroke="green" strokeWidth="2" />
          </svg>
          <ul className="autocomplete-results">
            {results.map((result) => (
              <li key={result.id} className="autocomplete-item">
                <div className="track-details">
                  <img src={result.album.images[0]?.url} alt={result.name} className="track-image" />
                  <a
                    href={result.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="autocomplete-link"
                  >
                    <div className="track-info" ref={(el) => (trackRefs.current[result.id] = { ...trackRefs.current[result.id], trackName: el })}>
                      <div>{result.name}</div>
                      <div className="artist-name" ref={(el) => (trackRefs.current[result.id] = { ...trackRefs.current[result.id], artistName: el })}>
                        {result.artists[0]?.name}
                      </div>
                    </div>
                  </a>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1.5em"
                  viewBox="0 0 384 512"
                  className={`svgIcon ${toggleStates[result.id] ? 'checked' : ''}`}
                  onClick={() => toggleButton(result.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <path d="M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z"></path>
                </svg>
              </li>
            ))}
          </ul>
        </label>
        <div className="logout-button">
          <button onClick={onLogout}>로그아웃</button>
        </div>
      </div>
    </header>
  );
};

export default Header;