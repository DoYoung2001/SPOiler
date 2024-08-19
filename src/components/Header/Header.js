import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from './Header.module.css'; // 모듈 스타일 가져오기

const Header = ({ onLogout }) => {
  const [token, setToken] = useState(''); // Spotify API를 호출하기 위한 토큰 상태
  const [query, setQuery] = useState(''); // 검색어 상태
  const [results, setResults] = useState([]); // 검색 결과 상태
  const [toggleStates, setToggleStates] = useState({}); // 각 트랙의 북마크 상태
  const trackRefs = useRef({}); // 각 트랙의 DOM 요소를 저장할 ref

  // 컴포넌트가 마운트될 때 Spotify API 토큰을 가져오는 함수
  useEffect(() => {
    const getToken = async () => {
      const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID; // 환경 변수에서 클라이언트 ID 가져오기
      const clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET; // 환경 변수에서 클라이언트 시크릿 가져오기
      const authString = `${clientId}:${clientSecret}`; // 인증 문자열 생성
      const authBase64 = btoa(authString); // Base64로 인코딩

      try {
        const response = await axios.post(
          'https://accounts.spotify.com/api/token',
          'grant_type=client_credentials',
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Authorization: `Basic ${authBase64}`, // 인증 헤더 추가
            }
          }
        );
        setToken(response.data.access_token); // 토큰 상태 업데이트
      } catch (error) {
        console.error('Error fetching Spotify token', error); // 에러 로그
      }
    };

    getToken(); // 토큰 가져오기 호출
  }, []);

  // 검색어가 변경될 때마다 Spotify에서 트랙을 검색
  const handleSearch = async (e) => {
    setQuery(e.target.value); // 검색어 상태 업데이트
    if (e.target.value && token) { // 검색어가 존재하고 토큰이 있는 경우
      try {
        const response = await axios.get(
          `https://api.spotify.com/v1/search?q=${e.target.value}&type=track&limit=15`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // 인증 헤더 추가
            }
          }
        );
        setResults(response.data.tracks.items); // 검색 결과 상태 업데이트
      } catch (error) {
        console.error('Error fetching search results', error); // 에러 로그
      }
    } else {
      setResults([]); // 검색어가 비어있으면 결과를 비움
    }
  };

  // 트랙의 북마크 상태를 토글하는 함수
  const toggleButton = async (trackId) => {
    try {
      setToggleStates((prevStates) => {
        const newState = !prevStates[trackId]; // 현재 북마크 상태를 반전
        alert(`Track ${newState ? 'bookmarked' : 'unbookmarked'}`); // 북마크 상태 변경 알림
        return {
          ...prevStates,
          [trackId]: newState, // 상태 업데이트
        };
      });

      // localStorage에서 토큰 가져오기
      const localToken = localStorage.getItem('token');
      if (!localToken) {
        console.error('Error: No token found in localStorage'); // 토큰이 없는 경우 에러 로그
        return;
      }

      // 백엔드에 북마크 요청을 보냄
      await axios.post(
        'http://localhost:8080/api/tracklist',
        { spotifyId: trackId }, // 트랙 ID를 요청 본문에 포함
        {
          headers: {
            Authorization: `Bearer ${localToken}`, // 인증 헤더 추가
          },
        }
      );
    } catch (error) {
      if (error.response) {
        console.error('Error toggling bookmark:', error.response.data); // 요청 에러 로그
      } else if (error.request) {
        console.error('Error toggling bookmark: No response received', error.request); // 응답 없음 에러 로그
      } else {
        console.error('Error toggling bookmark:', error.message); // 일반 에러 로그
      }
    }
  };

  // 텍스트가 잘리면 폰트 사이즈를 조정하는 함수
  const adjustFontSize = (element) => {
    if (element.scrollWidth > element.clientWidth) {
      element.style.fontSize = '0.8em'; // 텍스트가 잘리면 폰트 사이즈 축소
    } else {
      element.style.fontSize = '1em'; // 텍스트가 잘리지 않으면 기본 폰트 사이즈
    }
  };

  // 검색 결과가 변경될 때마다 폰트 사이즈 조정
  useEffect(() => {
    results.forEach((result) => {
      if (trackRefs.current[result.id]) {
        adjustFontSize(trackRefs.current[result.id].trackName);
        adjustFontSize(trackRefs.current[result.id].artistName);
      }
    });
  }, [results]);

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
        <label className={styles.search}>
          <input
            placeholder="Search"
            value={query}
            onChange={handleSearch} // 검색어 변경 시 핸들러 호출
          />
          <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="8" stroke="green" strokeWidth="2" />
            <line x1="16" y1="16" x2="22" y2="22" stroke="green" strokeWidth="2" />
          </svg>
          <ul className={styles.autocompleteResults}>
            {results.map((result) => (
              <li key={result.id} className={styles.autocompleteItem}>
                <div className={styles.trackDetails}>
                  <img src={result.album.images[0]?.url} alt={result.name} className={styles.trackImage} />
                  <a
                    href={result.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.autocompleteLink}
                  >
                    <div className={styles.trackInfo} ref={(el) => (trackRefs.current[result.id] = { ...trackRefs.current[result.id], trackName: el })}>
                      <div>{result.name}</div>
                      <div className={styles.artistName} ref={(el) => (trackRefs.current[result.id] = { ...trackRefs.current[result.id], artistName: el })}>
                        {result.artists[0]?.name}
                      </div>
                    </div>
                  </a>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1.5em"
                  viewBox="0 0 384 512"
                  className={`${styles.svgIcon} ${toggleStates[result.id] ? styles.checked : ''}`} // 북마크 상태에 따라 스타일 변경
                  onClick={() => toggleButton(result.id)} // 클릭 시 북마크 토글
                  style={{ cursor: 'pointer' }}
                >
                  <path d="M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z"></path>
                </svg>
              </li>
            ))}
          </ul>
        </label>
        <div className={styles.logoutButton}>
          <button onClick={onLogout}>로그아웃</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
