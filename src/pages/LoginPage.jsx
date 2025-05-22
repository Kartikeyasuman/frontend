import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://backend-3-d6a8.onrender.com/api/auth/login', {
        username,
        password,
      });

      const { token, role } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      if (role === 'Admin') navigate('/admin');
      else if (role === 'Manager') navigate('/manager');
      else navigate('/employee');
    } catch (err) {
      alert('Login failed!');
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>

      <p className="form-switch">
        Don’t have an account?{' '}
        <span onClick={() => navigate('/signup')}>Sign up</span>
      </p>
    </div>
  );
}
