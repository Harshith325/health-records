import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SummaryModal from './SummaryModal';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/ProfilePage.css';
import '../styles/Header.css';

const DoctorProfilePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { username, password } = location.state;
  const [doctorData, setDoctorData] = useState({});
  const [showSummary, setShowSummary] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [patients, setPatients] = useState([]);
  const [summary, setSummary] = useState('');

  useEffect(() => {
    const validateAndFetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/doctor', {
          params: { D_Em_Id: username }
        });
        
        if (!response.data) {
          navigate('/login');
          return;
        }
        
        setDoctorData(response.data);
      } catch (error) {
        console.error('Error:', error);
        navigate('/login');
      }
    };

    validateAndFetchData();
  }, [username, navigate]);
  
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('http://localhost:5000/patients');
        setPatients(response.data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };
    fetchPatients();
  }, []);

  const generateSummary = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/generate-summary/${selectedPatient}`);
      setSummary(response.data.summary);
      setShowSummary(true);
    } catch (error) {
      console.error('Error generating summary:', error);
    }
  };

  const goToAppointments = () => {
    console.log('Navigating to appointments with:', { username, userType: 'doctor' });
    navigate('/appointments', { state: { username, userType: 'doctor' } });
  };

  const goToPrescriptions = () => {
    navigate('/prescriptions', { state: { username, userType: 'doctor' } });
  };

  const goToCreate = () => {
    navigate('/create', { state: { username } });
  };

  const goToUploadPrescription = () => {
    navigate('/upload-prescription', { state: { username } });
  };

  return (
    <>
      <div className="header">
        <h1>PulsePoint</h1>
      </div>
      <div className="container" style={{ marginTop: '50px', padding: '20px' }}>
        <div className="row" style={{ gap: '20px' }}>
          <div className="col-md-4">
            <div className="card">
              <img
                src="https://images.assetsdelivery.com/compings_v2/juliatim/juliatim1607/juliatim160700013.jpg"
                className="card-img-top mx-auto d-block"
                style={{ 
                  height: '150px',
                  width: '150px',
                  objectFit: 'cover',
                  borderRadius: '50%',
                  margin: '20px auto'
                }}
                alt="Doctor"
              />
              <div className="card-body">
                <h5 className="card-title text-center">Doctor Information</h5>
              </div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item"><b>Doctor ID:</b> {doctorData.D_Em_Id}</li>
                <li className="list-group-item"><b>Name:</b> {doctorData.Name}</li>
                <li className="list-group-item"><b>Specialty:</b> {doctorData.Specialty}</li>
              </ul>
            </div>
          </div>
          <div className="col-md-7">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Actions</h5>
                <hr />
                <div className="d-grid gap-2">
                  <button className="btn btn-primary btn-lg" onClick={goToCreate}>Enter Data</button>
                  <button className="btn btn-primary btn-lg" onClick={goToUploadPrescription}>Upload Prescription</button>
                  <button className="btn btn-primary btn-lg" onClick={goToAppointments}>Appointments</button>
                  <button className="btn btn-primary btn-lg" onClick={goToPrescriptions}>Prescriptions</button>
                  <button className="btn btn-primary btn-lg" onClick={() => setShowSummary(true)}>Generate Summary</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showSummary && (
        <SummaryModal 
          show={showSummary}
          onHide={() => setShowSummary(false)}
          patients={patients}
          selectedPatient={selectedPatient}
          setSelectedPatient={setSelectedPatient}
          generateSummary={generateSummary}
          summary={summary}
        />
      )}
    </>
  );
};

export default DoctorProfilePage;