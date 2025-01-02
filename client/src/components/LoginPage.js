import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import app from '../firebaseConfig';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('Patient');
  const navigate = useNavigate();
  const auth = getAuth(app);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      alert(`Logged in as ${userType}`);

      // Navigate based on user type
      if (userType === 'Doctor') {
        navigate('/doctor-profile', { state: { email, userType } });
      } else {
        navigate('/patient-profile', { state: { email, userType } });
      }
    } catch (error) {
      console.error(error);
      alert('Invalid credentials or user does not exist');
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      alert(`Account created successfully! You are signed in as ${userType}`);
      
      // Navigate based on user type
      if (userType === 'Doctor') {
        navigate('/doctor-profile', { state: { email, userType } });
      } else {
        navigate('/patient-profile', { state: { email, userType } });
      }
    } catch (error) {
      console.error(error);
      alert('Failed to create account. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="header">
        <h1>Health Records App</h1>
      </div>
      <div className="container">
        <div className="box">
          <h1>{isSignUp ? 'Sign Up' : 'Login'}</h1>
          <form onSubmit={isSignUp ? handleSignUp : handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
            >
              <option value="Patient">Patient</option>
              <option value="Doctor">Doctor</option>
            </select>
            <button type="submit">{isSignUp ? 'Sign Up' : 'Login'}</button>
          </form>
          <p>
            {isSignUp ? 'Already have an account?' : 'Don’t have an account?'}{' '}
            <span
              className="toggle-link"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? 'Login' : 'Sign Up'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
