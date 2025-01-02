import React from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/ProfilePage.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const DoctorProfilePage = () => {
  const location = useLocation();
  const { username, password } = location.state;

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6" style={{ paddingRight: '85px' }}>
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
                <li className="list-group-item"><b>Doctor ID:</b> </li>
                <li className="list-group-item"><b>Name:</b> </li>
                <li className="list-group-item"><b>Speciality:</b> </li>
                <li className="list-group-item"><b>Contact Info:</b> </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Actions</h5>
              <hr />
              <div className="d-grid gap-2">
                <button className="btn btn-primary btn-lg">Appointments</button>
                <button className="btn btn-primary btn-lg">Prescription</button>
                <button className="btn btn-primary btn-lg">Medication</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfilePage;