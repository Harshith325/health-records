import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import DoctorProfilePage from './components/DoctorProfilePage';
import PatientProfilePage from './components/PatientProfilePage';
import MainPage from './components/MainPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/doctor-profile" element={<DoctorProfilePage />} />
        <Route path="/patient-profile" element={<PatientProfilePage />} />
      </Routes>
    </Router>
  );
};

export default App;
