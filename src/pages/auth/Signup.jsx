import React, { useState } from 'react';
import { useAuth } from '../../firebase/firebaseAuth';
import { useNavigate } from 'react-router-dom';
import User from '../../classes/User';
import { AddUserToFirestore } from '../../firebase/firebaseFirestore';
import companyLogo from '../../assets/logo.png'; // Import your company logo

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { SignUp } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      setLoading(true);

      const newUser = new User(email, password, "retailer");

      // Use Firebase auth to create a new user
      await SignUp(newUser);
      await AddUserToFirestore(newUser);

      navigate('/home');
      // Redirect or handle successful signup
    } catch (error) {
      // Handle signup error
      setError(error.message);
      console.error('Signup failed:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <header>
        <img src={companyLogo} alt="Company Logo" className="company-logo" />
        <h1>SimpliSupply Logistics</h1>
      </header>
      <div className="signup-content">
        <h2>Signup</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleSignup} disabled={loading}>
          {loading ? 'Signing up...' : 'Signup'}
        </button>
      </div>
    </div>
  );
};

export default Signup;
