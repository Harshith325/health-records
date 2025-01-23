import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from '../firebaseConfig'; // Import Firestore instance
import { doc, setDoc, getDoc } from 'firebase/firestore'; // Import Firestore functions
import '../styles/ProfilePage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Header.css';
import axios from 'axios';


const PatientProfilePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { username, password } = location.state;
  const [patientData, setPatientData] = useState({
    healthRecords: [], // Initialize with empty array
    healthLogs: {},
    wearablesData: []
  });
  const [loading, setLoading] = useState(true);

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

  // Function to generate fake health records
  const generateFakeHealthRecords = () => ([
    { organ: 'Heart', status: ['Good', 'Moderate', 'Prone to Disease'][Math.floor(Math.random() * 3)] },
    { organ: 'Lungs', status: ['Good', 'Moderate', 'Prone to Disease'][Math.floor(Math.random() * 3)] },
    { organ: 'Liver', status: ['Good', 'Moderate', 'Prone to Disease'][Math.floor(Math.random() * 3)] },
    { organ: 'Kidneys', status: ['Good', 'Moderate', 'Prone to Disease'][Math.floor(Math.random() * 3)] },
    { organ: 'Brain', status: ['Good', 'Moderate', 'Prone to Disease'][Math.floor(Math.random() * 3)] }
  ]);

  // Function to create or fetch patient entry in Firestore
  const fetchOrCreatePatientInFirestore = async () => {
    try {
      setLoading(true);
      const patientRef = doc(db, 'patients', username);
      const patientSnapshot = await getDoc(patientRef);

      if (!patientSnapshot.exists()) {
        const healthRecords = generateFakeHealthRecords();
        console.log('Generated new health records:', healthRecords);
        
        const fakeData = {
          P_Em_Id: username,
          Name: `Patient ${username}`,
          DOB: '1990-01-01',
          healthLogs: generateFakeHealthLogs(),
          wearablesData: generateFakeWearablesData(),
          healthRecords: healthRecords
        };

        await setDoc(patientRef, fakeData);
        console.log('Setting new patient data:', fakeData);
        setPatientData(fakeData);
      } else {
        const existingData = patientSnapshot.data();
        console.log('Fetched existing data:', existingData);
        
        // Ensure health records exist
        if (!existingData.healthRecords || !existingData.healthRecords.length) {
          existingData.healthRecords = generateFakeHealthRecords();
          await setDoc(patientRef, existingData);
        }
        setPatientData(existingData);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const validateAndFetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/patient', {
          params: { P_Em_Id: username }
        });
        
        if (!response.data) {
          navigate('/login');
          return;
        }
        
        fetchOrCreatePatientInFirestore();
      } catch (error) {
        console.error('Error:', error);
        navigate('/login');
      }
    };
  
    validateAndFetchData();
  }, [username, navigate]);

  console.log('Current patientData:', patientData); // Debug current state

  if (loading) {
    return <div>Loading...</div>;
  }

  const goToContact = () => {
    navigate('/contact', { state: { username } });
  };  
  const goToAppointments = () => {
    console.log('Navigating to appointments with:', { username, userType: 'patient' });
    navigate('/appointments', { state: { username, userType: 'patient' } });
  };
  const goToBilling = () => {
    navigate('/billing', { state: { username } });
  };
  const goToPrescriptions = () => {
    navigate('/prescriptions', { state: { username, userType: 'patient' } });
  };

  const goToHealthLogs = () => {
    navigate('/health-logs', { state: { username } });
  };

  const goToWearables = () => {
    navigate('/wearable-data', { state: { username } });
  };

  const goToHealthRecords = () => {
    navigate('/health-records', { state: { username } });
  };

  return (
    <>
    <div className="header">
      <h1>PulsePoint App</h1>
    </div>
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
                <button className="btn btn-primary btn-lg" onClick={goToContact}>Contact Doctors</button>
                <button className="btn btn-primary btn-lg" onClick={goToAppointments}>Appointments</button>
                <button className="btn btn-primary btn-lg" onClick={goToBilling}>Billing</button>
                <button className="btn btn-primary btn-lg" onClick={goToPrescriptions}>Prescription</button>
                <button className="btn btn-primary btn-lg" onClick={goToWearables}>Wearables</button>
              </div>
            </div>
          </div>
          <div className="card mt-3">
            <div className="card-body">
              <h5 className="card-title">Health Records</h5>
              <table className="table">
                <thead>
                  <tr>
                    <th>Body Part</th>
                    <th>Condition</th>
                  </tr>
                </thead>
                <tbody>
  {Array.isArray(patientData.healthRecords) ? 
    patientData.healthRecords.map((record, index) => (
      <tr key={index}>
        <td>{record.organ || record.bodyPart || 'N/A'}</td>
        <td>{record.status || record.condition || 'N/A'}</td>
      </tr>
    ))
    : 
    <tr>
      <td colSpan="2">No health records available</td>
    </tr>
  }
</tbody>
              </table>
            </div>
          </div>
        </div>
        {/* <div className="col-md-8"> */}
          
        {/* </div> */}
      </div>
    </div>
    </>
  );
};

export default PatientProfilePage;
