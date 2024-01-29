// components/Signup.js
import React, { useState } from 'react';
import { useAuth } from '../../firebase/firebaseAuth';
import { useNavigate } from 'react-router-dom';
import User from '../../classes/User';
import { AddUserToFirestore } from '../../firebase/firebaseFirestore';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {SignUp} = useAuth();

  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const newUser = new User(email, password, "retailer");
      
      // Use Firebase auth to create a new user
      await SignUp(newUser);
      await AddUserToFirestore(newUser);

      navigate('/home');
      // Redirect or handle successful signup
    } catch (error) {
      // Handle signup error
      
      console.error('Signup failed:', error.message);
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <label>Email:</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <label>Password:</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSignup}>Signup</button>
    </div>
  );
};

export default Signup;
