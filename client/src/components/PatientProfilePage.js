import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from '../firebaseConfig'; // Import Firestore instance
import { doc, setDoc, getDoc } from 'firebase/firestore'; // Import Firestore functions
import '../styles/ProfilePage.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const PatientProfilePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { username, password } = location.state;
  const [patientData, setPatientData] = useState({});

  // Function to generate fake health logs
  const generateFakeHealthLogs = () => ({
    height: `${160 + Math.floor(Math.random() * 40)} cm`, // Random height between 160-200 cm
    weight: `${50 + Math.floor(Math.random() * 50)} kg`, // Random weight between 50-100 kg
    hereditaryDiseases: ['Diabetes', 'Hypertension', 'None'][Math.floor(Math.random() * 3)] // Random disease
  });

  // Function to generate fake wearables data (avg heartrate every 15 mins for 24 hours)
  const generateFakeWearablesData = () => {
    const wearables = [];
    for (let i = 0; i < 96; i++) { // 96 readings (15 min intervals in 24 hours)
      wearables.push({
        timestamp: new Date(Date.now() - i * 15 * 60000).toISOString(), // Subtract 15 mins for each
        avgHeartRate: Math.floor(Math.random() * (100 - 60) + 60) // Random heart rate between 60-100
      });
    }
    return wearables;
  };

  // Function to create patient entry in Firestore
  const createPatientInFirestore = async () => {
    try {
      const patientRef = doc(db, 'patients', username);
      const patientSnapshot = await getDoc(patientRef);

      if (!patientSnapshot.exists()) {
        const fakeData = {
          P_Em_Id: username,
          Name: `Patient ${username}`,
          DOB: '1990-01-01', // Static DOB for now
          healthLogs: generateFakeHealthLogs(),
          wearablesData: generateFakeWearablesData()
        };

        await setDoc(patientRef, fakeData);
        setPatientData(fakeData);
      } else {
        setPatientData(patientSnapshot.data());
      }
    } catch (error) {
      console.error('Error creating or fetching patient data:', error);
    }
  };

  useEffect(() => {
    createPatientInFirestore();
  }, []);

  const goToAppointments = () => {
    console.log('Navigating to appointments with:', { username, userType: 'patient' });
    navigate('/appointments', { state: { username, userType: 'patient' } });
  };

  const goToHealthLogs = () => {
    navigate('/health-logs', { state: { username } });
  };

  const goToWearables = () => {
    navigate('/wearable-data', { state: { username } });
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-4" style={{ paddingRight: '85px' }}>
          <div className="shadow p-3 mb-5 bg-body-tertiary rounded" style={{ paddingTop: '150px' }}>
            <div className="card">
              <img
                src="https://www.clipartmax.com/png/middle/179-1795475_patient-free-icon-patient-icon-png.png"
                className="card-img-top mx-auto d-block"
                style={{ height: '3%' }}
                alt="Patient"
              />
              <div className="card-body">
                <h5 className="card-title" style={{ paddingTop: '5px' }}>Patient Information</h5>
              </div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item"><b>Patient ID:</b> {patientData.P_Em_Id}</li>
                <li className="list-group-item"><b>Name:</b> {patientData.Name}</li>
                <li className="list-group-item"><b>DOB:</b> {patientData.DOB}</li>
                <li className="list-group-item"><b>Height:</b> {patientData.healthLogs?.height}</li>
                <li className="list-group-item"><b>Weight:</b> {patientData.healthLogs?.weight}</li>
                <li className="list-group-item"><b>Hereditary Diseases:</b> {patientData.healthLogs?.hereditaryDiseases}</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Actions</h5>
              <hr />
              <div className="d-grid gap-2">
                <button className="btn btn-primary btn-lg" onClick={goToAppointments}>Appointments</button>
                <button className="btn btn-primary btn-lg">Billing</button>
                <button className="btn btn-primary btn-lg">Prescription</button>
                <button className="btn btn-primary btn-lg" onClick={goToHealthLogs}>Health Logs</button>
                <button className="btn btn-primary btn-lg" onClick={goToWearables}>Wearables</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfilePage;
