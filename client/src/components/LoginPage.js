import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import app from '../firebaseConfig';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('Patient');
  const navigate = useNavigate();
  const auth = getAuth(app);

  const notify = (message, type = 'info') => {
    toast[type](message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      notify(`Logged in successfully as ${userType}`, 'success');
      const user = userCredential.user;

      // Navigate based on user type
      setTimeout(() => {
        if (userType === 'Doctor') {
          navigate('/doctor-profile', { state: { email, userType } });
        } else {
          navigate('/patient-profile', { state: { email, userType } });
        }
      }, 1000); // Add a delay for better UX
    } catch (error) {
      console.error(error);
      notify('Invalid credentials or user does not exist', 'error');
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      notify(`Account created successfully! Signed up as ${userType}`, 'success');
      const user = userCredential.user;

      // Navigate based on user type
      setTimeout(() => {
        if (userType === 'Doctor') {
          navigate('/doctor-profile', { state: { email, userType } });
        } else {
          navigate('/patient-profile', { state: { email, userType } });
        }
      }, 1000); // Add a delay for better UX
    } catch (error) {
      console.error(error);
      notify('Failed to create account. Please try again.', 'error');
    }
  };

  return (
    <div className="login-container">
      <ToastContainer />
      <div className="header">
        <h1>Health Records App</h1>
      </div>
      <div className="auth-card">
        <h1 className="auth-title">{isSignUp ? 'Sign Up' : 'Login'}</h1>
        <form onSubmit={isSignUp ? handleSignUp : handleLogin}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="form-select"
            >
              <option value="Patient">Patient</option>
              <option value="Doctor">Doctor</option>
            </select>
          </div>
          <button type="submit" className="auth-button">
            {isSignUp ? 'Sign Up' : 'Login'}
          </button>
        </form>
        <p className="toggle-text">
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
  );
};

export default LoginPage;
