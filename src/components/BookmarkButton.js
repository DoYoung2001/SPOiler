import React, { useState } from 'react';
import '../styles/BookmarkButton.css'; // CSS 파일을 불러옵니다

// SVG 아이콘을 React 컴포넌트로 변환
const BookmarkIcon = ({ isChecked }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="1.5em"
    viewBox="0 0 384 512"
    className={`svgIcon ${isChecked ? 'checked' : ''}`}
  >
    <path d="M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z"></path>
  </svg>
);

// 체크박스와 SVG 아이콘을 포함한 버튼 컴포넌트
const BookmarkButton = ({ id }) => {
  const [isChecked, setIsChecked] = useState(false);

  // 체크박스 상태를 토글하는 함수
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div>
        <div className="bookmark-container">
      <input
        type="checkbox"
        id={id}
        checked={isChecked}
        onChange={handleCheckboxChange}
        style={{ display: 'none' }} // 체크박스를 숨깁니다
      />
      <label htmlFor={id} className="bookmark" onClick={handleCheckboxChange}>
        <BookmarkIcon isChecked={isChecked} />
      </label>
      </div>
    </div>
  );
};

export default BookmarkButton;
