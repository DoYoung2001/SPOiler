import React, { useState } from "react";
import axios from 'axios';  // axios import 추가
import styles from "./Login.module.css";

const Login = ({ onLogin, onRegisterClick }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // 에러 메시지를 위한 state 추가

  const handleLogin = async (event) => {
    event.preventDefault();
    setError(""); // 에러 메시지 초기화

    if (email && password) {
      try {
        const response = await axios.post('http://localhost:8080/api/users/login', {
          email,
          password
        });
        
        // 로그인 성공 시 토큰 저장
        localStorage.setItem('token', response.data.token);
        
        // 로그인 성공 처리
        onLogin();
        navigate("/"); // 로그인 후 메인 페이지로 이동
      } catch (error) {
        // 로그인 실패 처리
        const errorMessage = error.response?.data?.message || "이메일이나 비밀번호가 잘못 입력되었습니다.";
        window.alert(errorMessage);
      }
    } else {
      window.alert("이메일과 비밀번호를 입력하세요.");
    }
  };

  return (
    <div className={styles["login-container"]}>
      <form id={styles.form} onSubmit={handleLogin}>
        <div id={styles["form-body"]}>
          <div id={styles["welcome-lines"]}>
            <div id={styles["welcome-line-1"]}>Spotify</div>
            <div id={styles["welcome-line-2"]}>Welcome !</div>
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
          {error && <div className={styles["error-message"]}>{error}</div>}
          <div id={styles["login-button-cvr"]}>
            <button id={styles["login-button"]} type="submit" className={styles["login-button"]}>
              Login
            </button>
          </div>
          <div id={styles["register"]}>
            <a href="#" onClick={onRegisterClick} className={styles["register-button"]}>
              Register
            </a>
          </div>
          <div id={styles["bar"]}></div>
        </div>
      </form>
    </div>
  );
};

export default Login;