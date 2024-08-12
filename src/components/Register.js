import React from 'react';

const Register = ({ onSubmit }) => {
  return (
    <div id="form-ui"className="register-container" >
  <form action="" method="post" id="form" >
    <div id="form-body">
      <div id="welcome-lines">
        <div id="welcome-line-1">Spotify</div>
        <div id="welcome-line-2">Sign up ! </div>
      </div>
      <div id="input-area">
        <div class="form-inp">
          <input placeholder="Email Address" type="text" />
        </div>
        <div class="form-inp">
          <input placeholder="Password" type="password" />
        </div>
      </div>
      <div id="register">
        <a href="#" onClick={onSubmit} className="register-button">Register</a>
      </div>
      <div id="bar"></div>
    </div>
  </form>
  </div>
  );
};

export default Register;

