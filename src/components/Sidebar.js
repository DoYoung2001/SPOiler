import React, { useState } from "react";
import TracklistAlert from "./TracklistAlert"; // 모달 컴포넌트 임포트
import "../styles/TracklistAlert.css"; // 스타일 파일 임포트
import { useNavigate } from "react-router-dom"; // useNavigate 훅 임포트

const Sidebar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleDeleteClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    console.log("플레이리스트가 삭제되었습니다.");
    setShowConfirmDialog(false);
  };

  const handleCancelDelete = () => {
    setShowConfirmDialog(false);
  };

  const navigate = useNavigate(); // useNavigate 훅 사용

  // 홈 버튼 클릭 시 MainContent로 이동
  const handleHomeClick = () => {
    navigate("/"); // 루트 경로로 이동
  };

  // 내 플레이리스트 클릭 시 호출될 함수
  const goToPlaylist = () => {
    navigate("/playlist");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-item" onClick={handleHomeClick}>
       
        {/* 홈 클릭 시 handleHomeClick 호출 */}
        <div className="icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24px"
            height="24px"
            fill="currentColor"
            viewBox="0 0 256 256"
          >
            <path d="M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.53,0,1.14,1.14,0,0,0,.11.11l80,75.48A16,16,0,0,1,224,115.55Z" />
          </svg>
        </div>
        <span class="name">홈</span>
      
      </div>
      <div className="sidebar-item" onClick={goToPlaylist}>
      
        <div className="icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24px"
            height="24px"
            fill="currentColor"
            viewBox="0 0 256 256"
          >
            <path d="M32,64a8,8,0,0,1,8-8H216a8,8,0,0,1,0,16H40A8,8,0,0,1,32,64Zm8,72H160a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16Zm72,48H40a8,8,0,0,0,0,16h72a8,8,0,0,0,0-16Zm135.66-57.7a8,8,0,0,1-10,5.36L208,122.75V192a32.05,32.05,0,1,1-16-27.69V112a8,8,0,0,1,10.3-7.66l40,12A8,8,0,0,1,247.66,126.3ZM192,192a16,16,0,1,0-16,16A16,16,0,0,0,192,192Z" />
          </svg>
        </div>
        <span class="name">내 플레이리스트</span>
       
      </div>
      <div className="menuItem" onClick={openModal}>
      
        <div className="icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24px"
            height="24px"
            fill="currentColor"
            viewBox="0 0 256 256"
          >
            <path d="M232,64H24A8,8,0,0,0,16,72V208a8,8,0,0,0,8,8H232a8,8,0,0,0,8-8V72A8,8,0,0,0,232,64ZM40,80H216a8,8,0,0,1,8,8v56H32V88A8,8,0,0,1,40,80ZM224,176H32v-8h16a8,8,0,0,0,8-8V136a8,8,0,0,0-8-8H32v-8h192v8h-8a8,8,0,0,0-8,8v24a8,8,0,0,0,8,8h8Z" />
          </svg>
        </div>
        <span class="name">내 플레이리스트 추가</span>
       
      </div>
      <TracklistAlert isOpen={isModalOpen} onClose={closeModal} />
      <div className="sidebar-delete">
        <button className="delete-button" onClick={handleDeleteClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24px"
            height="24px"
            fill="currentColor"
            viewBox="0 0 256 256"
          >
            <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z" />
          </svg>
          플레이리스트 삭제
        </button>
      </div>
      {showConfirmDialog && (
        <div className="confirm-dialog-overlay">
          <div className="confirm-dialog">
            <p className="cancel-text">삭제하시겠습니까?</p>
            <div className="confirm-dialog-buttons">
              <button onClick={handleConfirmDelete}>확인</button>
              <button onClick={handleCancelDelete}>취소</button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
export default Sidebar;
