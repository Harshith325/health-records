import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Appointments.css';

const Appointments = () => {
  const location = useLocation();
  const { username, userType } = location.state;
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [newAppointment, setNewAppointment] = useState({
    App_Id: '',
    P_Em_Id: '',
    D_Em_Id: username,
    Date: '',
    Time: ''
  });

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/appointments', {
          params: userType === 'Patient' ? { P_Em_Id: username } : { D_Em_Id: username }
        });
        setAppointments(response.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    const fetchDoctors = async () => {
      try {
        const response = await axios.get('http://localhost:5000/doctors');
        setDoctors(response.data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    const fetchPatients = async () => {
      try {
        const response = await axios.get('http://localhost:5000/patients');
        setPatients(response.data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchAppointments();
    fetchDoctors();
    if (userType === 'Doctor') {
      fetchPatients();
    }
  }, [username, userType]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAppointment = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/appointments', newAppointment);
      setAppointments((prev) => [...prev, newAppointment]);
      setNewAppointment({
        App_Id: '',
        P_Em_Id: '',
        D_Em_Id: username,
        Date: '',
        Time: ''
      });
    } catch (error) {
      console.error('Error adding appointment:', error);
    }
  };

  const exportTableToCSV = (filename) => {
    let csv = [];
    const rows = document.querySelectorAll("table tr");

    for (let i = 0; i < rows.length; i++) {
      const row = [];
      const cols = rows[i].querySelectorAll("td, th");

      for (let j = 0; j < cols.length; j++) {
        row.push(cols[j].innerText);
      }

      csv.push(row.join(","));
    }

    // Download CSV file
    const csvFile = new Blob([csv.join("\n")], { type: "text/csv" });
    const downloadLink = document.createElement("a");
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
  };

  const generatePDF = () => {
    const element = document.getElementById('appointmentsTable');
    const opt = {
      margin: 1,
      filename: 'Appointments.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    window.html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="container mt-5">
      <h2 style={{ textAlign: 'center', paddingBottom: '0px' }}>Appointments</h2>
      <hr />
      <div className="row" style={{ paddingLeft: '15px', paddingRight: '15px' }}>
        <div className="shadow p-3 mb-5 bg-body-tertiary rounded" style={{ width: '100%', overflowX: 'auto' }}>
          <div style={{ textAlign: 'right', marginBottom: '2%', marginRight: '2%' }}>
            <button onClick={() => exportTableToCSV('Appointments.csv')} className="btn btn-info">Export as CSV</button>
            <button onClick={generatePDF} className="btn btn-info">Generate PDF</button>
          </div>
          <table className="table" id="appointmentsTable">
            <thead>
              <tr>
                <th scope="col">Appointment ID</th>
                <th scope="col">Date</th>
                <th scope="col">Time</th>
                <th scope="col">Patient ID</th>
                <th scope="col">Doctor ID</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
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
      {userType === 'Patient' && (
        <div className="row" style={{ paddingLeft: '15px', paddingRight: '15px' }}>
          <div className="shadow p-3 mb-5 bg-body-tertiary rounded" style={{ width: '100%', overflowX: 'auto' }}>
            <h3>Doctors List</h3>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Doctor ID</th>
                  <th scope="col">Name</th>
                  <th scope="col">Specialty</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doctor) => (
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
      )}
      {userType === 'Doctor' && (
        <div className="row" style={{ paddingLeft: '15px', paddingRight: '15px' }}>
          <div className="shadow p-3 mb-5 bg-body-tertiary rounded" style={{ width: '100%', overflowX: 'auto' }}>
            <h3>Add Appointment</h3>
            <form onSubmit={handleAddAppointment}>
              <div className="form-group">
                <label htmlFor="App_Id">Appointment ID</label>
                <input
                  type="text"
                  id="App_Id"
                  name="App_Id"
                  value={newAppointment.App_Id}
                  onChange={handleInputChange}
                  required
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="P_Em_Id">Patient ID</label>
                <select
                  id="P_Em_Id"
                  name="P_Em_Id"
                  value={newAppointment.P_Em_Id}
                  onChange={handleInputChange}
                  required
                  className="form-control"
                >
                  <option value="">Select Patient</option>
                  {patients.map((patient) => (
                    <option key={patient.P_Em_Id} value={patient.P_Em_Id}>
                      {patient.P_Em_Id} - {patient.Name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="Date">Date</label>
                <input
                  type="date"
                  id="Date"
                  name="Date"
                  value={newAppointment.Date}
                  onChange={handleInputChange}
                  required
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="Time">Time</label>
                <input
                  type="time"
                  id="Time"
                  name="Time"
                  value={newAppointment.Time}
                  onChange={handleInputChange}
                  required
                  className="form-control"
                />
              </div>
              <button type="submit" className="btn btn-primary mt-3">Add Appointment</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;