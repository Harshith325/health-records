import React from 'react';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <div>
      <h1>Welcome to the Health Records App</h1>
      <p>Please log in to access your health records.</p>
      <button onClick={goToLogin}>Go to Login</button>
    </div>
  );
};

export default MainPage;
