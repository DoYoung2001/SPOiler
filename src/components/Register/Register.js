import React, { useState } from "react";
import axios from 'axios';
import styles from "./Register.module.css";
import { useNavigate } from "react-router-dom"; // useNavigate import

const Register = ({ onRegisterSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleRegister = async (event) => {
    event.preventDefault(); // 폼 제출 시 페이지 새로고침 방지

    if (email && password) { // 이메일과 비밀번호가 입력되었는지 확인
      try {
        await axios.post('http://localhost:8080/api/users/register', {
          email,
          password
        });
        
        window.alert("회원가입이 완료되었습니다."); // 성공 메시지
        navigate("/login"); // 로그인 페이지로 전환
      } catch (error) {
        // 오류 처리
        // 오류 메시지를 표시하지 않음
      }
    } else {
      window.alert("이메일과 비밀번호를 입력하세요."); // 입력 필드가 비어있을 경우
    }
  }

  return (
    <div className={styles["register-container"]}>
      <form id={styles.form} onSubmit={handleRegister}>
        <div id={styles["form-body"]}>
          <div id={styles["welcome-lines"]}>
            <div id={styles["welcome-line-1"]}>Spotify</div>
            <div id={styles["welcome-line-2"]}>Sign up !</div>
          </div>
          <div id={styles["input-area"]}>
            <div className={styles["form-inp"]}>
              <input
                placeholder="Email Address"
                type="email" // 이메일 형식으로 변경
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required // 필수 입력 필드로 설정
              />
            </div>
            <div className={styles["form-inp"]}>
              <input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required // 필수 입력 필드로 설정
              />
            </div>
          </div>
          <div id={styles["register-button-cvr"]}>
            <button id={styles["register-button"]} type="submit" className={styles["register-button"]}>
              Register
            </button>
          </div>
          <div id={styles["bar"]}></div>
        </div>
      </form>
    </div>
  );
};

export default Register;