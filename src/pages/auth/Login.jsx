import React, { useState } from 'react';
import { useAuth } from '../../firebase/firebaseAuth';
import { useNavigate } from 'react-router-dom';
import User from '../../classes/User';
import companyLogo from '../../assets/logo.png'; // Import your company logo

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const { Login } = useAuth();

  const handleLogin = async () => {
    try {
      const loginUser = new User(email, password, "retailer");

      // Use Firebase auth to sign in
      await Login(loginUser);
      navigate('/home');
      // Redirect or handle successful login
    } catch (error) {
      // Handle login error
      console.error('Login failed:', error.message);
    }
  };

  return (
    <div className="login-container">
      <header>
        <img src={companyLogo} alt="Company Logo" className="company-logo" />
        <h1>SimpliSupply Logistics</h1>
      </header>
      <div className="login-content">
        <h2>Login</h2>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};

export default Login;
