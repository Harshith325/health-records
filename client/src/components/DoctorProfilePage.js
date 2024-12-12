import React from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/ProfilePage.css';

const DoctorProfilePage = () => {
  const location = useLocation();
  const { username, password } = location.state;

  return (
    <>
      <div className="header">
        <h1>Doctor Profile Page</h1>
      </div>
      <div className="container">
        <div className="box">
          <h1>Doctor Profile</h1>
          <p>Username: {username}</p>
          <p>Password: {password}</p>
        </div>
      </div>
    </>
  );
};

export default DoctorProfilePage;