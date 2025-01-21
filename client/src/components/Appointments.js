import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Appointments.css';

const Appointments = () => {
  const location = useLocation();
  const { username, userType } = location.state;
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // Debug log for userType
        console.log('Current userType:', userType);
        console.log('Is patient?', userType.toLowerCase() === 'patient');
        
        // Use toLowerCase() for consistent comparison
        const params = userType.toLowerCase() === 'patient'
          ? { P_Em_Id: username } 
          : { D_Em_Id: username };
        
        console.log('Fetching appointments with params:', params);
        const response = await axios.get('http://localhost:5000/appointments', { params });
        console.log('Fetched appointments:', response.data);
        setAppointments(response.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, [username, userType]);

  return (
    <div className="container mt-5">
      <h2 style={{ textAlign: 'center' }}>Your Appointments</h2>
      <hr />
      <div className="shadow p-3 mb-5 bg-body-tertiary rounded">
        <table className="table">
          <thead>
            <tr>
              <th>Appointment ID</th>
              <th>Date</th>
              <th>Time</th>
              <th>Patient ID</th>
              <th>Doctor ID</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(appointment => (
              <tr key={appointment.App_Id}>
                <td>{appointment.App_Id}</td>
                <td>{appointment.Date}</td>
                <td>{appointment.Time}</td>
                <td>{appointment.P_Em_Id}</td>
                <td>{appointment.D_Em_Id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Appointments;