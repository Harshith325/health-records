import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MainPage.css';

const MainPage = () => {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate('/login');
  };

  useEffect(() => {
    const script1 = document.createElement('script');
    script1.src = "https://code.jquery.com/jquery-3.2.1.slim.min.js";
    script1.integrity = "sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN";
    script1.crossOrigin = "anonymous";
    document.body.appendChild(script1);

    const script2 = document.createElement('script');
    script2.src = "https://cdn.jsdelivr.net/npm/popper.js@1.12.9/dist/umd/popper.min.js";
    script2.integrity = "sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q";
    script2.crossOrigin = "anonymous";
    document.body.appendChild(script2);

    const script3 = document.createElement('script');
    script3.src = "https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js";
    script3.integrity = "sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl";
    script3.crossOrigin = "anonymous";
    document.body.appendChild(script3);

    const script4 = document.createElement('script');
    script4.src = "https://res.cloudinary.com/dxfq3iotg/raw/upload/v1561436720/particles.js";
    document.body.appendChild(script4);

    const script5 = document.createElement('script');
    script5.src = "https://res.cloudinary.com/dxfq3iotg/raw/upload/v1561436735/app.js";
    document.body.appendChild(script5);

    return () => {
      document.body.removeChild(script1);
      document.body.removeChild(script2);
      document.body.removeChild(script3);
      document.body.removeChild(script4);
      document.body.removeChild(script5);
    };
  }, []);

  return (
    <>
      <div className="header">
        <h1>Health Records App</h1>
      </div>
      <div className="container">
        <div id="particles-js"></div>
        <div className="box">
          <h1>Welcome to the Health Records App</h1>
        </div>
        <div className="box">
          <p>Please log in to access your health records.</p>
        </div>
        <button onClick={goToLogin}>Go to Login</button>
      </div>
    </>
  );
};

export default MainPage;