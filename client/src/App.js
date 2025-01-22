import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage';
import LoginPage from './components/LoginPage';
import PatientProfilePage from './components/PatientProfilePage';
import DoctorProfilePage from './components/DoctorProfilePage';
import Appointments from './components/Appointments';
import HealthLogs from './components/HealthLogs';
import WearableData from './components/WearableData';
import BillingPage from './components/BillingPage';
import PrescriptionPage from './components/PrescriptionPage';
import CreatePage from './components/CreatePage';
import ContactPage from './components/ContactPage';
import Layout from './components/layout/Layout';
import UploadPrescriptionPage from './components/UploadPrescriptionPage';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/patient-profile" element={<PatientProfilePage />} />
          <Route path="/doctor-profile" element={<DoctorProfilePage />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/health-logs" element={<HealthLogs />} />
          <Route path="/wearable-data" element={<WearableData />} />
          <Route path="/billing" element={<BillingPage />} />
          <Route path="/prescriptions" element={<PrescriptionPage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/upload-prescription" element={<UploadPrescriptionPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
