import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import '../styles/ProfilePage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Header.css';
import axios from 'axios';

const PatientProfilePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Destructure all the passed values from the login page:
  const { username, userType, name: passedName, dob: passedDob, height: passedHeight, weight: passedWeight, hereditary: passedHereditary } = location.state;
  
  const [patientData, setPatientData] = useState({
    healthRecords: [],
    healthLogs: {},
    wearablesData: []
  });
  const [loading, setLoading] = useState(true);

  // Function to generate fake health logs (used only if user did not provide data)
  

  // Function to generate fake wearables data
  const generateFakeWearablesData = () => {
    const wearables = [];
    for (let i = 0; i < 96; i++) {
      wearables.push({
        timestamp: new Date(Date.now() - i * 15 * 60000).toISOString(),
        avgHeartRate: Math.floor(Math.random() * (100 - 60) + 60)
      });
    }
    return wearables;
  };

  // Function to generate fake health records
  const generateFakeHealthRecords = (hereditaryDisease) => {
    // Normalize the input (e.g., "Diabetes", "Hypertension", "None")
    const disease = hereditaryDisease ? hereditaryDisease.toLowerCase() : 'none';
  
    if (disease === 'diabetes') {
      return [
        { organ: 'Heart', status: 'Moderate' },
        { organ: 'Lungs', status: 'Good' },
        { organ: 'Liver', status: 'Prone' },
        { organ: 'Kidneys', status: 'Prone' },
        { organ: 'Brain', status: 'Good' }
      ];
    } else if (disease === 'hypertension') {
      return [
        { organ: 'Heart', status: 'Prone' },
        { organ: 'Lungs', status: 'Good' },
        { organ: 'Liver', status: 'Good' },
        { organ: 'Kidneys', status:'Moderate' },
        { organ: 'Brain', status: 'Prone' }
      ];
    } else if (disease === 'heart disease') {
      return [
        { organ: 'Heart', status: 'Prone' },
        { organ: 'Lungs', status: 'Moderate' },
        { organ: 'Liver', status: 'Good' },
        { organ: 'Kidneys', status:'Good' },
        { organ: 'Brain', status: 'Prone' }
      ];
    } else {
      // For "None" or any unrecognized hereditary disease, assume optimal health
      return [
        { organ: 'Heart', status: 'Good' },
        { organ: 'Lungs', status: 'Good' },
        { organ: 'Liver', status: 'Good' },
        { organ: 'Kidneys', status: 'Good' },
        { organ: 'Brain', status: 'Good' }
      ];
    }
  };
  

  const fetchOrCreatePatientInFirestore = async () => {
    try {
      setLoading(true);
      const patientRef = doc(db, 'patients', username);
      const patientSnapshot = await getDoc(patientRef);

      if (!patientSnapshot.exists()) {
        // Use passed values if available; otherwise fall back to fake data:
        const healthLogs = {
          height: passedHeight,
          weight: passedWeight,
          hereditaryDiseases: passedHereditary
        };

        const healthRecords = generateFakeHealthRecords(passedHereditary);
        
        const newData = {
          P_Em_Id: username,
          Name: passedName || `Patient ${username}`,
          DOB: passedDob || '1990-01-01',
          healthLogs: healthLogs,
          wearablesData: generateFakeWearablesData(),
          healthRecords: healthRecords
        };

        await setDoc(patientRef, newData);
        setPatientData(newData);
      } else {
        const existingData = patientSnapshot.data();
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

  if (loading) {
    return <div>Loading...</div>;
  }

  // Navigation functions remain the same:
  const goToContact = () => {
    navigate('/contact', { state: { username } });
  };  
  const goToAppointments = () => {
    navigate('/appointments', { state: { username, userType: 'patient' } });
  };
  const goToBilling = () => {
    navigate('/billing', { state: { username } });
  };
  const goToPrescriptions = () => {
    navigate('/prescriptions', { state: { username, userType: 'patient' } });
  };
  const goToWearables = () => {
    navigate('/wearable-data', { state: { username } });
  };

  return (
    <>
      <div className="header">
        <h1>PulsePoint</h1>
      </div>
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-4" style={{ paddingRight: '85px' }}>
            <div className="shadow p-3 mb-5 bg-body-tertiary rounded">
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
            {/* Actions and health records rendering remain unchanged */}
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
        </div>
      </div>
    </>
  );
};

export default PatientProfilePage;
