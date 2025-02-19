import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Appointments.css';
import '../styles/Header.css';


const BillingPage = () => {
  const location = useLocation();
  const { username } = location.state;
  const [billingData, setBillingData] = useState([]);

  useEffect(() => {
    const fetchBillingData = async () => {
      try {
        console.log('Fetching billing data for:', username);
        const response = await axios.get('http://localhost:5000/billing', {
          params: { P_Em_Id: username }
        });
        console.log('Fetched billing data:', response.data);
        setBillingData(response.data);
      } catch (error) {
        console.error('Error fetching billing data:', error);
      }
    };

    fetchBillingData();
  }, [username]);

  return (
    <>
    <div className="header">
      <h1>PulsePoint</h1>
    </div>
    <div className="container mt-5">
      <h2 style={{ textAlign: 'center' }}>Your Billing History</h2>
      <hr />
      <div className="shadow p-3 mb-5 bg-body-tertiary rounded">
        <table className="table">
          <thead>
            <tr>
              <th>Bill ID</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {billingData.map(bill => (
              <tr key={bill.Bill_ID}>
                <td>{bill.Bill_ID}</td>
                <td>₹{bill.Amount}</td>
                <td>{bill.Status}</td>
                <td>{new Date(bill.Date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
};

export default BillingPage;