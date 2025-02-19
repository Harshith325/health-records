import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Appointments.css';
import '../styles/Header.css';

const PrescriptionPage = () => {
  const location = useLocation();
  const { username, userType } = location.state;
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        console.log('Current userType:', userType);
        const params = userType.toLowerCase() === 'patient'
          ? { P_Em_Id: username }
          : { D_Em_Id: username };
        
        console.log('Fetching prescriptions with params:', params);
        const response = await axios.get('http://localhost:5000/prescriptions', { params });
        console.log('Fetched prescriptions:', response.data);
        setPrescriptions(response.data);
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
      }
    };

    fetchPrescriptions();
  }, [username, userType]);

  return (
    <>
      <div className="header">
        <h1>PulsePoint</h1>
      </div>
      <div className="container mt-5">
        <h2 style={{ textAlign: 'center' }}>Your Prescriptions</h2>
        <hr />
        <div className="shadow p-3 mb-5 bg-body-tertiary rounded">
          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            <table className="table">
              <thead style={{ position: 'sticky', top: 0, background: 'white' }}>
                <tr>
                  <th>Prescription ID</th>
                  <th>Date</th>
                  <th>Notes</th>
                  <th>Medications</th>
                  <th>Patient ID</th>
                  <th>Doctor ID</th>
                </tr>
              </thead>
              <tbody>
                {prescriptions.map(prescription => (
                  <tr key={prescription.Pre_ID}>
                    <td>{prescription.Pre_ID}</td>
                    <td>{new Date(prescription.Date).toLocaleDateString()}</td>
                    <td>{prescription.Notes}</td>
                    <td>{prescription.Medications || 'No medications'}</td>
                    <td>{prescription.P_Em_Id}</td>
                    <td>{prescription.D_Em_Id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrescriptionPage;