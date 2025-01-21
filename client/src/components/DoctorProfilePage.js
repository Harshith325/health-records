import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/ProfilePage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const DoctorProfilePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { username, password } = location.state;
  const [doctorData, setDoctorData] = useState({});

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/doctor', {
          params: { D_Em_Id: username }
        });
        console.log('Fetched doctor data:', response.data);
        setDoctorData(response.data);
      } catch (error) {
        console.error('Error fetching doctor data:', error);
      }
    };

    fetchDoctorData();
  }, [username]);

  const goToAppointments = () => {
    console.log('Navigating to appointments with:', { username, userType: 'doctor' });
    navigate('/appointments', { state: { username, userType: 'doctor' } });
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-4" style={{ paddingRight: '85px' }}>
          <div className="shadow p-3 mb-5 bg-body-tertiary rounded" style={{ paddingTop: '150px' }}>
            <div className="card">
              <img
                src="https://images.assetsdelivery.com/compings_v2/juliatim/juliatim1607/juliatim160700013.jpg"
                className="card-img-top mx-auto d-block"
                style={{ height: '3%' }}
                alt="Doctor"
              />
              <div className="card-body">
                <h5 className="card-title" style={{ paddingTop: '5px' }}>Doctor Information</h5>
                <p className="card-text"></p>
              </div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item"><b>Doctor ID:</b> {doctorData.D_Em_Id}</li>
                <li className="list-group-item"><b>Name:</b> {doctorData.Name}</li>
                <li className="list-group-item"><b>Specialty:</b> {doctorData.Specialty}</li>
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

export default DoctorProfilePage;