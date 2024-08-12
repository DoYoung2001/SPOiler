import React, { useState } from "react";
import "../styles/TracklistAlert.css";

function SpotifyStyleAlert({ isOpen, onClose }) {
  // isOpen 상태와 onClose 함수 추가
  const [playlistName, setPlaylistName] = useState("");

  const handleInputChange = (e) => {
    setPlaylistName(e.target.value);
  };

  const handleSubmit = () => {
    if (playlistName.trim()) {
      alert(`Your new playlist "${playlistName}" has been created!`);
      setPlaylistName(""); // 초기화
      onClose(); // 모달 창 닫기
    }
  };

  if (!isOpen) return null; // 모달이 열려있지 않으면 아무것도 렌더링하지 않음

  return (
    <div className="modalOverlay">
      <div className="alertBox">
        <h2 className="alertTitle">플레이리스트 추가</h2>
        <input
          type="text"
          value={playlistName}
          onChange={handleInputChange}
          placeholder="원하는 제목을 입력하세요"
          className="input"
        />
        <button
          onClick={handleSubmit}
          disabled={!playlistName.trim()}
          className={`button ${playlistName.trim() ? "active" : "inactive"}`}
        >
          확인
        </button>
        <button onClick={onClose} className="closeButton">
          닫기
        </button>{" "}
        {/* 닫기 버튼 추가 */}
      </div>
    </div>
  );
}

export default SpotifyStyleAlert;
