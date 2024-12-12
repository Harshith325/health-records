import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('patient');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', { username, password, userType });
      alert(`Logged in as ${response.data.role}`);
      if (userType === 'Doctor') {
        navigate('/doctor-profile', { state: { username, password, userType } });
      } else {
        navigate('/patient-profile', { state: { username, password, userType } });
      }
    } catch (error) {
      alert('Invalid credentials');
    }
  };

  return (
    <>
      <div className="header">
        <h1>Health Records App</h1>
      </div>
      <div className="container">
        <div className="box">
          <h1>Login</h1>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
            >
              <option value="Patient">Patient</option>
              <option value="Doctor">Doctor</option>
            </select>
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
