import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useLocation } from 'react-router-dom';
// import '../styles/HealthLogs.css';

const HealthLogs = () => {
  const location = useLocation();
  const { username } = location.state || {};
  const [healthRecords, setHealthRecords] = useState([]);

  useEffect(() => {
    if (!username) return;

    const fetchHealthRecords = async () => {
      try {
        const recordsRef = collection(db, 'patients', username, 'health_records');
        const snapshot = await getDocs(recordsRef);
        const records = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setHealthRecords(records);
      } catch (error) {
        console.error('Error fetching health records:', error);
      }
    };

    fetchHealthRecords();
  }, [username]);

  return (
    <div className="health-logs">
      <h1>Health Records</h1>
      {healthRecords.length > 0 ? (
        <ul>
          {healthRecords.map((record) => (
            <li key={record.id}>
              <p><strong>Diagnosis:</strong> {record.Diagnosis}</p>
              <p><strong>Prescription:</strong> {record.Prescription}</p>
              <p><strong>Doctor:</strong> {record.Doctor}</p>
              <p><strong>Date:</strong> {record.Date}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No health records found.</p>
      )}
    </div>
  );
};

export default HealthLogs;
