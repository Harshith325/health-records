import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/ProfilePage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const PatientProfilePage = () => {
  const location = useLocation();
  const { username, password } = location.state;
  const [patientData, setPatientData] = useState({});

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/patient');
        console.log('Fetched patient data:', response.data); // Add this line to log the fetched data
        setPatientData(response.data);
      } catch (error) {
        console.error('Error fetching patient data:', error);
      }
    };

    fetchPatientData();
  }, []);

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
                <p className="card-text"></p>
              </div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item"><b>Patient ID:</b> {patientData.Patient_ID}</li>
                <li className="list-group-item"><b>Name:</b> {patientData.Name}</li>
                <li className="list-group-item"><b>DOB:</b> {patientData.DOB}</li>
                <li className="list-group-item"><b>Contact Info:</b> {patientData.Phone_Number}</li>
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
                <button className="btn btn-primary btn-lg">Appointments</button>
                <button className="btn btn-primary btn-lg">Billing</button>
                <button className="btn btn-primary btn-lg">Prescription</button>
                <button className="btn btn-primary btn-lg">Health Logs</button>
                <button className="btn btn-primary btn-lg">Wearables</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfilePage;
