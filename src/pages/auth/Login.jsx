// components/Login.js
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {  useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const {login} = useAuth();

  const handleLogin = async () => {
    try {

      // Use Firebase auth to sign in
      await login(email, password);
      navigate('/home');
      // Redirect or handle successful login
    } catch (error) {
      // Handle login error
      console.error('Login failed:', error.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <label>Email:</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <label>Password:</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
