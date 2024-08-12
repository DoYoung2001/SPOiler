import React from 'react';


const Login = ({ onLogin, onRegisterClick }) => {
  return (
<div id="form-ui"className="login-container" >
  <form action="" method="post" id="form" >
    <div id="form-body">
      <div id="welcome-lines">
        <div id="welcome-line-1">Spotify</div>
        <div id="welcome-line-2">Welcome ! </div>
      </div>
      <div id="input-area">
        <div class="form-inp">
          <input placeholder="Email Address" type="text" />
        </div>
        <div class="form-inp">
          <input placeholder="Password" type="password" />
        </div>
      </div>
      <div id="submit-button-cvr">
        <button id="submit-button" type="submit"onClick={onLogin} className="login-button">Login</button>
      </div>
      <div id="register">
        <a href="#" onClick={onRegisterClick} className="register-button">Register</a>
      </div>
      <div id="bar"></div>
    </div>
  </form>
  </div>
 );
};

 
    
 

export default Login;
