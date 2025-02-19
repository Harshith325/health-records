import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Appointments.css';
import '../styles/Header.css';

const ContactPage = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('http://localhost:5000/doctors');
        console.log('Fetched doctors:', response.data);
        setDoctors(response.data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <>
    <div className="header">
      <h1>PulsePoint</h1>
    </div>
    <div className="container mt-5">
      <h2 style={{ textAlign: 'center' }}>Contact Doctors</h2>
      <hr />
      <div className="shadow p-3 mb-5 bg-body-tertiary rounded">
        <table className="table">
          <thead>
            <tr>
              <th>Email ID</th>
              <th>Name</th>
              <th>Specialty</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map(doctor => (
              <tr key={doctor.D_Em_Id}>
                <td>{doctor.D_Em_Id}</td>
                <td>{doctor.Name}</td>
                <td>{doctor.Specialty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
};

export default ContactPage;