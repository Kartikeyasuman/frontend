import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const [softwares, setSoftwares] = useState([]);
  const [selectedSoftware, setSelectedSoftware] = useState('');
  const [accessType, setAccessType] = useState('Read');
  const [reason, setReason] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  useEffect(() => {
    const fetchSoftwares = async () => {
      try {
        const res = await axios.get('https://backend-3-d6a8.onrender.com/api/software');
        setSoftwares(res.data);
      } catch (err) {
        alert('Failed to fetch software list');
      }
    };
    fetchSoftwares();
  }, []);

  const handleRequest = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('https://backend-3-d6a8.onrender.com/api/requests', {
        softwareId: selectedSoftware,
        accessType,
        reason
      }, {
        headers: { Authorization: token }
      });

      alert('Request submitted successfully');
      setSelectedSoftware('');
      setAccessType('Read');
      setReason('');
    } catch (err) {
      alert('Failed to submit request');
    }
  };

  return (
    <div className="employee-dashboard container">
      <div className="header">
        <h2>Employee Dashboard</h2>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <form onSubmit={handleRequest}>
        <select
          value={selectedSoftware}
          onChange={(e) => setSelectedSoftware(e.target.value)}
          required
        >
          <option value="">-- Select Software --</option>
          {softwares.map((soft) => (
            <option key={soft.id} value={soft.id}>{soft.name}</option>
          ))}
        </select>

        <select value={accessType} onChange={(e) => setAccessType(e.target.value)}>
          <option value="Read">Read</option>
          <option value="Write">Write</option>
          <option value="Admin">Admin</option>
        </select>

        <textarea
          placeholder="Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        />

        <button type="submit">Submit Request</button>
      </form>
    </div>
  );
}
