import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [accessLevels, setAccessLevels] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const handleCheckboxChange = (level) => {
    setAccessLevels((prev) =>
      prev.includes(level)
        ? prev.filter((l) => l !== level)
        : [...prev, level]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'https://backend-3-d6a8.onrender.com/api/software',
        {
          name,
          description,
          accessLevels,
        },
        {
          headers: { Authorization: token },
        }
      );
      alert('Software created successfully');
      setName('');
      setDescription('');
      setAccessLevels([]);
    } catch (err) {
      alert('Failed to create software');
    }
  };

  return (
    <div className="admin-dashboard container">
      <div className="header">
        <h2>Admin Dashboard</h2>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Software Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              value="Read"
              checked={accessLevels.includes('Read')}
              onChange={() => handleCheckboxChange('Read')}
            /> Read
          </label>
          <label>
            <input
              type="checkbox"
              value="Write"
              checked={accessLevels.includes('Write')}
              onChange={() => handleCheckboxChange('Write')}
            /> Write
          </label>
          <label>
            <input
              type="checkbox"
              value="Admin"
              checked={accessLevels.includes('Admin')}
              onChange={() => handleCheckboxChange('Admin')}
            /> Admin
          </label>
        </div>

        <button type="submit">Create Software</button>
      </form>
    </div>
  );
}
