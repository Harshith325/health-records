import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const HealthRecords = ({ username }) => {
    const [healthRecordsData, setHealthRecordsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHealthRecords = async () => {
            try {
                const patientRef = doc(db, 'patients', username);
                const patientDoc = await getDoc(patientRef);

                if (patientDoc.exists()) {
                    const patientData = patientDoc.data();
                    const records = patientData.healthRecords;

                    if (Array.isArray(records)) {
                        setHealthRecordsData(records);
                    } else if (records) {
                        console.error("healthRecords is not an array:", records);
                        setError("Invalid health records format in Firestore.");
                    } else {
                        setHealthRecordsData([]); // Handle missing healthRecords
                    }
                } else {
                    setError("Patient not found.");
                }
            } catch (err) {
                console.error("Error fetching health records:", err);
                setError(`Failed to fetch health records: ${err.message}`); // Include error message
            } finally {
                setLoading(false);
            }
        };

        fetchHealthRecords();
    }, [username]);

    if (loading) {
        return <div>Loading health records...</div>;
    }

    if (error) {
        return <div className="text-danger">Error: {error}</div>; // Use text-danger for error styling
    }

    if (!healthRecordsData || healthRecordsData.length === 0) {
        return <p>No health records available.</p>;
    }

    return (
        <div className="table-responsive">
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Body Part</th>
                        <th>Condition</th>
                    </tr>
                </thead>
                <tbody>
                    {healthRecordsData.map((record, index) => (
                        <tr key={index}>
                            <td>{record?.bodyPart ?? "N/A"}</td>
                            <td>{record?.condition ?? "N/A"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default HealthRecords;