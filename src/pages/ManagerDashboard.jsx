import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ManagerDashboard() {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('https://backend-3-d6a8.onrender.com/api/requests?status=Pending', {
        headers: { Authorization: token }
      });
      setRequests(res.data);
    } catch (err) {
      alert('Failed to fetch requests');
    }
  };

  const handleDecision = async (id, decision) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`https://backend-3-d6a8.onrender.com/api/requests/${id}`, { status: decision }, {
        headers: { Authorization: token }
      });
      setRequests((prev) => prev.filter((req) => req.id !== id));
    } catch (err) {
      alert('Failed to update request');
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="manager-dashboard container">
      <div className="header">
        <h2>Manager Dashboard</h2>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      {requests.length === 0 ? (
        <p className="no-data">No Requests Pending</p>
      ) : (
        <ul className="request-list">
          {requests.map((req) => (
            <li key={req.id} className="request-card">
              <p><strong>User:</strong> {req.user.username}</p>
              <p><strong>Software:</strong> {req.software.name}</p>
              <p><strong>Access Type:</strong> {req.accessType}</p>
              <p><strong>Reason:</strong> {req.reason}</p>
              <div className="action-btns">
                <button className="approve-btn" onClick={() => handleDecision(req.id, 'Approved')}>Approve</button>
                <button className="reject-btn" onClick={() => handleDecision(req.id, 'Rejected')}>Reject</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
