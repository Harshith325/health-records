import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { createWorker } from 'tesseract.js';
import '../styles/Header.css';

const UploadPrescriptionPage = () => {
  const location = useLocation();
  const { username } = location.state;
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [file, setFile] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

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

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const worker = await createWorker('eng');
      
      // Set progress
      setProgress(25);
      
      const imageData = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });

      setProgress(50);
      
      // Perform OCR
      const { data } = await worker.recognize(imageData);
      console.log('Extracted text:', data.text);
      setProgress(75);
      
      
      // Clean up
      await worker.terminate();

      // Submit to backend
      await axios.post('http://localhost:5000/prescriptions', {
        P_Em_Id: selectedPatient,
        D_Em_Id: username,
        Date: selectedDate,
        Notes: data.text,
        skipMedication: true
      });

      setProgress(100);
      alert('Prescription uploaded successfully!');
      setSelectedPatient('');
      setSelectedDate('');
      setFile(null);
    } catch (error) {
      console.error('Error:', error);
      alert('Error processing prescription: ' + error.message);
    } finally {
      setLoading(false);
      setProgress(0);
    }
};

  return (
    <>
      <div className="header">
        <h1>PulsePoint</h1>
      </div>
      <div className="container mt-5">
        <h2 style={{ textAlign: 'center' }}>Upload Prescription</h2>
        <hr />
        <div className="shadow p-3 mb-5 bg-body-tertiary rounded">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Patient</label>
              <select 
                className="form-control"
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
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
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Prescription Document</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
            </div>
            {loading && (
              <div className="progress mb-3">
                <div 
                  className="progress-bar" 
                  role="progressbar" 
                  style={{ width: `${progress}%` }}
                  aria-valuenow={progress} 
                  aria-valuemin="0" 
                  aria-valuemax="100"
                >
                  {progress}%
                </div>
              </div>
            )}
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Upload'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default UploadPrescriptionPage;