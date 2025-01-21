import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage';
import LoginPage from './components/LoginPage';
import PatientProfilePage from './components/PatientProfilePage';
import DoctorProfilePage from './components/DoctorProfilePage';
import Appointments from './components/Appointments';
import HealthLogs from './components/HealthLogs';
import WearableData from './components/WearableData';
//import Billing from './components/Billing';<Route path="/billing" element={<Billing />} />
       // <Route path="/prescription" element={<Prescription />} />
//import Prescription from './components/Prescription';
// import Particles from 'react-tsparticles';

const App = () => {
  const particlesInit = (main) => {
    // Initialize tsparticles instance (optional)
  };

  const particlesLoaded = (container) => {
    // Callback after particles are loaded (optional)
  };

  return (
    <Router>
      {/* <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          fullScreen: { enable: true, zIndex: -1 },
          background: {
            color: {
              value: "#007bff", // Blue background
            },
          },
          fpsLimit: 60,
          interactivity: {
            events: {
              onClick: { enable: true, mode: "push" },
              onHover: { enable: true, mode: "repulse" },
              resize: true,
            },
            modes: {
              push: { quantity: 4 },
              repulse: { distance: 200, duration: 0.4 },
            },
          },
          particles: {
            color: { value: "#ffffff" },
            links: {
              color: "#ffffff",
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            collisions: { enable: false },
            move: {
              direction: "none",
              enable: true,
              outModes: { default: "bounce" },
              random: false,
              speed: 2,
              straight: false,
            },
            number: { density: { enable: true, area: 800 }, value: 50 },
            opacity: { value: 0.5 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 5 } },
          },
          detectRetina: true,
        }}
      /> */}
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/patient-profile" element={<PatientProfilePage />} />
        <Route path="/doctor-profile" element={<DoctorProfilePage />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/health-logs" element={<HealthLogs />} />
        <Route path="/wearable-data" element={<WearableData />} />
      </Routes>
    </Router>
  );
};

export default App;
