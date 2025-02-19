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
  // New fields for patients:
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [hereditary, setHereditary] = useState('');
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

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // (Additional login logic remains the same)
      notify(`Logged in successfully as ${userType}`, 'success');
      
      setTimeout(() => {
        if (userType === 'Doctor') {
          navigate('/doctor-profile', { state: { username: email, userType } });
        } else {
          // Pass the extra patient details in state:
          navigate('/patient-profile', { state: { username: email, userType, name, dob, height, weight, hereditary } });
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

      setTimeout(() => {
        if (userType === 'Doctor') {
          navigate('/doctor-profile', { state: { username: email, userType } });
        } else {
          // Pass the extra patient details:
          navigate('/patient-profile', { state: { username: email, userType, name, dob, height, weight, hereditary } });
        }
      }, 1000);
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
                  <>
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
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="Height (e.g., 170 cm)"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        required
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="Weight (e.g., 65 kg)"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        required
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="Hereditary Diseases (e.g., None)"
                        value={hereditary}
                        onChange={(e) => setHereditary(e.target.value)}
                        required
                        className="form-input"
                      />
                    </div>
                  </>
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
