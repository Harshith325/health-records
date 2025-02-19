import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MainPage.css';
import '../styles/Header.css';

const MainPage = () => {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate('/login');
  };


  return (
    <>
      <div className="header">
      <div className="header-content">
        <img 
          src="/pulse-logo.png" 
          alt="PulsePoint Logo" 
          className="header-logo"
        />
        <h1>PulsePoint</h1>
      </div>
    </div>
      <div className="container">
        <div id="particles-js"></div>
        <div className="box">
          <h1>Welcome to PulsePoint</h1>
          </div>
        <div className="box">
          <p>Please log in to access your health records.</p>
        <button onClick={goToLogin}>Go to Login</button>
        </div>
      </div>
    </>
  );
};

export default MainPage;