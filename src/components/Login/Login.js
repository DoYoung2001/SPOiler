import React, { useState } from "react";
import styles from "./Login.module.css"; // CSS 모듈 import

const Login = ({ onLogin, onRegisterClick }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (event) => {
    event.preventDefault(); // 폼 제출 시 페이지 새로고침 방지
    if (email && password) {
      onLogin(); // 이메일과 비밀번호가 제공되면 onLogin 호출
    } else {
      console.error("이메일과 비밀번호를 입력하세요.");
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
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className={styles["form-inp"]}>
              <input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div id={styles["submit-button-cvr"]}>
            <button id={styles["submit-button"]} type="submit" className={styles["login-button"]}>
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
