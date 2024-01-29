// components/Home.js
import React from 'react';
import { useAuth } from '../firebase/firebaseAuth';
import { useNavigate } from 'react-router-dom';

const Home = () => {

  const { currentUser, LogOut} = useAuth();

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Use Firebase auth to sign out
      await LogOut();
      navigate('/');
      console.log("logged out");
      // Redirect or handle successful logout
    } catch (error) {
      // Handle logout error
      console.error('Logout failed:', error.message);
    }
  };

  return (
    <div>
      <h2>Welcome to the Home Page {currentUser.email}</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home;
