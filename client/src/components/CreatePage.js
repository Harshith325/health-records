import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Header.css';

const CreatePage = () => {
  const location = useLocation();
  const { username } = location.state;
  const [selectedTable, setSelectedTable] = useState('');
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({});

  // Fetch patients list
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

  const handleTableSelect = (e) => {
    setSelectedTable(e.target.value);
    setFormData({}); // Reset form when table changes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = `http://localhost:5000/${selectedTable}`;
      const submitData = {
        ...formData,
        D_Em_Id: username,
        skipMedication: false
      };
      
      console.log('Submitting data:', submitData, 'to endpoint:', endpoint);
      
      const response = await axios.post(endpoint, submitData);
      console.log('Server response:', response.data);
      
      alert('Data created successfully!');
      setFormData({});
      setSelectedTable('');
    } catch (error) {
      console.error('Error details:', error.response || error);
      alert(`Error creating data: ${error.response?.data || error.message}`);
    }
  };

  const renderForm = () => {
    switch(selectedTable) {
      case 'appointments':
        return (
          <div className="mb-3">
            <div className="mb-3">
              <label className="form-label">Patient</label>
              <select 
                className="form-control"
                value={formData.P_Em_Id || ''}
                onChange={e => setFormData({...formData, P_Em_Id: e.target.value})}
                required
              >
                <option value="">Select Patient</option>
                {patients.map(patient => (
                  <option key={patient.P_Em_Id} value={patient.P_Em_Id}>
                    {patient.Name} ({patient.P_Em_Id})
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-control"
                value={formData.Date || ''}
                onChange={e => setFormData({...formData, Date: e.target.value})}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Time</label>
              <input
                type="time"
                className="form-control"
                value={formData.Time || ''}
                onChange={e => setFormData({...formData, Time: e.target.value})}
                required
              />
            </div>
          </div>
        );

        case 'prescriptions':
          return (
            <div className="mb-3">
              <div className="mb-3">
                <label className="form-label">Patient</label>
                <select 
                  className="form-control"
                  value={formData.P_Em_Id || ''}
                  onChange={e => setFormData({...formData, P_Em_Id: e.target.value})}
                  required
                >
                  <option value="">Select Patient</option>
                  {patients.map(patient => (
                    <option key={patient.P_Em_Id} value={patient.P_Em_Id}>
                      {patient.Name} ({patient.P_Em_Id})
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.Date || ''}
                  onChange={e => setFormData({...formData, Date: e.target.value})}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-control"
                  value={formData.Notes || ''}
                  onChange={e => setFormData({...formData, Notes: e.target.value})}
                  required
                />
              </div>
              <div className="mb-3">
                <h5>Medication Details</h5>
                <div className="mb-3">
                  <label className="form-label">Medicine Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.MedicineName || ''}
                    onChange={e => setFormData({...formData, MedicineName: e.target.value})}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Dosage</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.Dosage || ''}
                    onChange={e => setFormData({...formData, Dosage: e.target.value})}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Frequency</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.Frequency || ''}
                    onChange={e => setFormData({...formData, Frequency: e.target.value})}
                    required
                  />
                </div>
              </div>
            </div>
          );

      case 'billing':
        return (
          <div className="mb-3">
            <div className="mb-3">
              <label className="form-label">Patient</label>
              <select 
                className="form-control"
                value={formData.P_Em_Id || ''}
                onChange={e => setFormData({...formData, P_Em_Id: e.target.value})}
                required
              >
                <option value="">Select Patient</option>
                {patients.map(patient => (
                  <option key={patient.P_Em_Id} value={patient.P_Em_Id}>
                    {patient.Name} ({patient.P_Em_Id})
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Amount</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                value={formData.Amount || ''}
                onChange={e => setFormData({...formData, Amount: e.target.value})}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Status</label>
              <select
                className="form-control"
                value={formData.Status || ''}
                onChange={e => setFormData({...formData, Status: e.target.value})}
                required
              >
                <option value="">Select Status</option>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-control"
                value={formData.Date || ''}
                onChange={e => setFormData({...formData, Date: e.target.value})}
                required
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
    <div className="header">
      <h1>PulsePoint App</h1>
    </div>
    <div className="container mt-5">
      <h2 style={{ textAlign: 'center' }}>Create New Entry</h2>
      <hr />
      <div className="shadow p-3 mb-5 bg-body-tertiary rounded">
        <div className="mb-3">
          <label className="form-label">Select Table</label>
          <select 
            className="form-control"
            value={selectedTable}
            onChange={handleTableSelect}
          >
            <option value="">Select Table</option>
            <option value="appointments">Appointment</option>
            <option value="prescriptions">Prescription</option>
            <option value="billing">Billing</option>
          </select>
        </div>
        {selectedTable && (
          <form onSubmit={handleSubmit}>
            {renderForm()}
            <button type="submit" className="btn btn-primary">Create</button>
          </form>
        )}
      </div>
    </div>
    </>
  );
};

export default CreatePage;