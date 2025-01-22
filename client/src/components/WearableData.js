import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import '../styles/WearablesData.css'; // Import your CSS file
import '../styles/Header.css';

const WearablesData = () => {
    const location = useLocation();
    const { username } = location.state;
    const [wearablesData, setWearablesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWearablesData = async () => {
            try {
                const patientRef = doc(db, 'patients', username);
                const patientDoc = await getDoc(patientRef);

                if (patientDoc.exists()) {
                    const data = patientDoc.data();
                    if (data.wearablesData && Array.isArray(data.wearablesData)) {
                        // Sort data by timestamp in descending order (newest first)
                        const sortedData = [...data.wearablesData].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                        setWearablesData(sortedData);
                    } else {
                        setError("No wearables data found for this user.");
                    }
                } else {
                    setError("Patient not found.");
                }
            } catch (err) {
                console.error("Error fetching wearables data:", err);
                setError("Failed to fetch wearables data.");
            } finally {
                setLoading(false);
            }
        };

        fetchWearablesData();
    }, [username]);

    if (loading) {
        return <div className="loading">Loading wearables data...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (wearablesData.length === 0) {
        return <div className="no-data">No wearables data available.</div>;
    }

    return (
        <>
    <div className="header">
      <h1>PulsePoint App</h1>
    </div>
        <div className="wearables-container">
            <h2>Wearables Data</h2>
            <table className="wearables-table">
                <thead>
                    <tr>
                        <th>Timestamp</th>
                        <th>Average Heart Rate</th>
                    </tr>
                </thead>
                <tbody>
                    {wearablesData.map((data, index) => (
                        <tr key={index}>
                            <td>{new Date(data.timestamp).toLocaleString()}</td> {/* Format timestamp */}
                            <td>{data.avgHeartRate} bpm</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </>
    );
};

export default WearablesData;