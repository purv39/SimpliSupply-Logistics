// components/Home.js
import React from 'react';
import { useAuth } from '../firebase/firebaseAuth';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap
import "../styles/Home.css";


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

  const handleDistributor = () => {
    navigate('/AddDistributor'); // Navigate to the Add Distributor page
  };

  return (
    <div>
      <h2>Welcome to the Home Page {currentUser.email}</h2>
      <button onClick={handleLogout}>Logout</button>
      <button className="btn btn-add-distributor" onClick={handleDistributor}>Add Distributor</button>
    </div>
  );
};

export default Home;
