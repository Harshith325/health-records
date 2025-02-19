import React from 'react';
import '../styles/Header.css';
import '../styles/Modal.css';

const SummaryModal = ({ 
  show, 
  onHide, 
  patients, 
  selectedPatient, 
  setSelectedPatient, 
  generateSummary, 
  summary 
}) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Patient Summary</h3>
          <button className="close-button" onClick={onHide}>&times;</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Select Patient</label>
            <select 
              className="form-control"
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
            >
              <option value="">Select a patient...</option>
              {patients.map(patient => (
                <option key={patient.P_Em_Id} value={patient.P_Em_Id}>
                  {patient.Name} ({patient.P_Em_Id})
                </option>
              ))}
            </select>
          </div>
          {summary && (
            <div className="summary-content">
              <h5>Summary:</h5>
              <pre className="summary-text">{summary}</pre>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button 
            className="btn btn-secondary" 
            onClick={onHide}
          >
            Close
          </button>
          <button 
            className="btn btn-primary" 
            onClick={generateSummary}
            disabled={!selectedPatient}
          >
            Generate Summary
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryModal;