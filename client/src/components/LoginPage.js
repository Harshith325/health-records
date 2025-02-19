import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import app from '../firebaseConfig';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/LoginPage.css';
import axios from 'axios';
import '../styles/Header.css';

const LoginPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('Patient');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [specialty, setSpecialty] = useState('');
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

// Update handleLogin function
const handleLogin = async (e) => {
  e.preventDefault();
  try {
    // First authenticate with Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Then verify user exists in MySQL
    let exists = false;
    if (userType === 'Doctor') {
      const response = await axios.get('http://localhost:5000/doctor', {
        params: { D_Em_Id: email }
      });
      exists = response.data !== null && Object.keys(response.data).length > 0;
    } else {
      const response = await axios.get('http://localhost:5000/patient', {
        params: { P_Em_Id: email }
      });
      exists = response.data !== null && Object.keys(response.data).length > 0;
    }

    if (!exists) {
      notify('User not found in database. Please sign up first.', 'error');
      await auth.signOut(); // Sign out from Firebase
      return;
    }

    notify(`Logged in successfully as ${userType}`, 'success');
    
    // Navigate based on user type
    setTimeout(() => {
      if (userType === 'Doctor') {
        navigate('/doctor-profile', { state: { username: email, userType } });
      } else {
        navigate('/patient-profile', { state: { username: email, userType } });
      }
    }, 1000);
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

      // Insert patient or doctor data into MySQL database
      if (userType === 'Patient') {
        await axios.post('http://localhost:5000/patient', {
          P_Em_Id: email,
          Name: name,
          DOB: dob,
        });
      } else if (userType === 'Doctor') {
        await axios.post('http://localhost:5000/doctor', {
          D_Em_Id: email,
          Name: name,
          Specialty: specialty,
        });
      }

      // Navigate based on user type
      setTimeout(() => {
        if (userType === 'Doctor') {
          navigate('/doctor-profile', { state: { username: email, userType } });
        } else {
          navigate('/patient-profile', { state: { username: email, userType } });
        }
      }, 1000); // Add a delay for better UX
    } catch (error) {
      console.error(error);
      notify('Failed to create account. Please try again.', 'error');
    }
  };

  return (
    <>
    <div className="header">
      <h1>PulsePoint</h1>
    </div>
    <div className="login-container">
      <ToastContainer />
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
          {isSignUp && (
            <>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
              {userType === 'Patient' && (
                <div className="form-group">
                  <input
                    type="date"
                    placeholder="Date of Birth"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                    className="form-input"
                  />
                </div>
              )}
              {userType === 'Doctor' && (
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Specialty"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    required
                    className="form-input"
                  />
                </div>
              )}
            </>
          )}
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
    </>
  );
};

export default LoginPage;