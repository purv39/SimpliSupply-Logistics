import React from 'react';
import { useAuth } from '../firebase/firebaseAuth';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap
import "../styles/Home.css";
import logo from '../assets/logo.png'; // Import your logo

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

  const navigateTo = (path) => {
    navigate(path); // Navigate to the specified path
  };

  return (
    <div className="dashboard">
      <div className="header">
        <img src={logo} alt="Company Logo" className="logo" />
        <h2>Welcome to the Home Page, {currentUser.email}</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <div className="navigation">
        <button className="navigation-tab" onClick={() => navigateTo('/AddDistributor')}>Add Distributor</button>
        <button className="navigation-tab" onClick={() => navigateTo('/OrderHistory')}>Order History</button>
        <button className="navigation-tab" onClick={() => navigateTo('/DistributorList')}>Distributor List</button>
        <button className="navigation-tab" onClick={() => navigateTo('/CreateNewOrder')}>Create New Order</button>

        {/* Add more navigation tabs as needed */}
      </div>
      <div className="content">
        {/* Add your main content here */}
      </div>
    </div>
  );
};

export default Home;
