import React from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/ProfilePage.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const PatientProfilePage = () => {
  const location = useLocation();
  const { username, password } = location.state;

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Patient Information</h5>
              <hr />
              <p className="card-text"><strong>Patient ID:</strong> </p>
              <p className="card-text"><strong>Name:</strong> </p>
              <p className="card-text"><strong>DOB:</strong> </p>
              <p className="card-text"><strong>Address:</strong> </p>
              <p className="card-text"><strong>Contact Info:</strong> </p>
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
