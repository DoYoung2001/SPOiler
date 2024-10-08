import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 가져오기
import axios from 'axios';
import styles from './Header.module.css';

const Header = ({ onLogout }) => {
  const [token, setToken] = useState('');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const trackRefs = useRef({});
  const navigate = useNavigate(); // useNavigate 훅 초기화
  const autocompleteRef = useRef(null); // 자동완성 결과에 대한 참조 추가

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
          `https://api.spotify.com/v1/search?q=${e.target.value}&type=track&limit=31`,
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

  const handleSearchSubmit = (e) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지
    if (query) {
      navigate(`/search?query=${encodeURIComponent(query)}`); // 검색 페이지로 이동
    }
  };

  const handleAutocompleteClick = async (trackName) => {
    setQuery(trackName);
    try {
      const response = await axios.get(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(trackName)}&type=track&limit=31`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      setResults(response.data.tracks.items);
      navigate(`/search?query=${encodeURIComponent(trackName)}`);
    } catch (error) {
      console.error('Error fetching search results for autocomplete click', error);
    }
  };

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

  // 클릭 이벤트 핸들러
  const handleClickOutside = (event) => {
    if (autocompleteRef.current && !autocompleteRef.current.contains(event.target)) {
      setResults([]); // 자동완성 결과 숨기기
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside); // 문서 클릭 이벤트 리스너 추가
    return () => {
      document.removeEventListener('mousedown', handleClickOutside); // 컴포넌트 언마운트 시 리스너 제거
    };
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <div className={styles.logo}>
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"
              fill="currentColor"
            />
          </svg>
          <h2>SPOiler</h2>
        </div>
        <nav className={styles.headerNav}></nav>
      </div>
      <div className={styles.headerRight}>
        <form onSubmit={handleSearchSubmit}> {/* 폼으로 감싸기 */}
          <label className={styles.search}>
            <input
              placeholder="Search"
              value={query}
              onChange={handleSearch}
            />
            <svg
              className={styles.searchIcon}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={handleSearchSubmit} // 아이콘 클릭 시 검색 제출
              style={{ cursor: 'pointer' }}
            >
              <circle cx="11" cy="11" r="8" stroke="green" strokeWidth="2" />
              <line x1="16" y1="16" x2="22" y2="22" stroke="green" strokeWidth="2" />
            </svg>
            <ul className={styles.autocompleteResults} ref={autocompleteRef}> {/* 자동완성 결과에 ref 추가 */}
              {results.map((result) => (
                <li key={result.id} className={styles.autocompleteItem} onClick={() => handleAutocompleteClick(result.name)}>
                  <div className={styles.trackDetails}>
                    <img src={result.album.images[0]?.url} alt={result.name} className={styles.trackImage} />
                    <div className={styles.trackInfo} ref={(el) => (trackRefs.current[result.id] = { ...trackRefs.current[result.id], trackName: el })}>
                      <div>{result.name}</div>
                      <div className={styles.artistName} ref={(el) => (trackRefs.current[result.id] = { ...trackRefs.current[result.id], artistName: el })}>
                        {result.artists[0]?.name}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </label>
        </form>
        <div className={styles.logoutButton}>
          <button onClick={onLogout}>로그아웃</button>
        </div>
      </div>
    </header>
  );
};

export default Header;