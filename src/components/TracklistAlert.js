import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/TracklistAlert.css";

// onPlaylistAdded를 props로 받도록 수정
function TracklistAlert({ isOpen, onClose, onPlaylistAdded }) {
  const [playlistName, setPlaylistName] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setPlaylistName(e.target.value);
  };

  const handleSubmit = () => {
    if (playlistName.trim()) {
      // 새로 생성된 플레이리스트 이름으로 페이지 이동
      navigate(`/playlist/${playlistName}`);
      setPlaylistName("");
      if (onPlaylistAdded) {
        // onPlaylistAdded가 존재할 때만 호출
        onPlaylistAdded(playlistName); // 플레이리스트 이름을 인수로 전달
      }
      onClose();
    }
  };

  if (!isOpen) return null;

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
        </button>
      </div>
    </div>
  );
}

export default TracklistAlert;
