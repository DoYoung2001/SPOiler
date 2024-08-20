import React, { useState } from "react";
import styles from "./BookmarkButton.module.css"; // 모듈 스타일 가져오기
import axios from "axios";

// SVG 아이콘을 React 컴포넌트로 변환
const BookmarkIcon = ({ id, isChecked }) => (
  <label htmlFor={id} className={styles.bookmark}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="1.5em"
      viewBox="0 0 384 512"
      className={`${styles.svgIcon} ${isChecked ? styles.checked : ""}`}
    >
      <path d="M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z"></path>
    </svg>
  </label>
);

// 체크박스와 SVG 아이콘을 포함한 버튼 컴포넌트
const BookmarkButton = ({ trackId, initialBookmarked }) => {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  // 체크박스 상태를 토글하는 함수
  const token = localStorage.getItem("token");
  const onClick = async () => {
    if (!isBookmarked) {
      await addBookmark();
    } else {
      await removeBookmark();
    }
    setIsBookmarked(!isBookmarked);
  };
  const addBookmark = async () => {
    const response = await axios.post(
      "http://localhost:8080/api/tracklist",
      { spotifyId: trackId },
      {
        headers: {
          Authorization: `Bearer ${token}`, // 토큰을 헤더에 포함
        },
      }
    );
    console.log("Track successfully bookmarked:", response.data);
  };
  const removeBookmark = async () => {
    const response = await axios.delete(
      `http://localhost:8080/api/tracklist/${trackId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // 토큰을 헤더에 포함
        },
      }
    );
    console.log("Track successfully removed from bookmarks:", response.data);
  };

  return (
    <div className={styles.bookmarkContainer} onClick={onClick}>
      <BookmarkIcon id={trackId} isChecked={isBookmarked} />
    </div>
  );
};

export default BookmarkButton;
