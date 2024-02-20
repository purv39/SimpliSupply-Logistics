import React from 'react';
import { useAuth } from '../firebase/firebaseAuth';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap
import "../styles/Home.css";
import logo from '../assets/logo.png'; // Import your logo
import picture from '../assets/Dashboard.webp'; // Import your logo

const Home = () => {
  const { currentUser, LogOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await LogOut();
      navigate('/');
      console.log("Logged out successfully");
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <div className="dashboard">
      <div className="navbar">
        <div className="logo">SimpliSupply Logistics</div>
        <nav>
          <ul>
            <li><button className="nav-button" onClick={() => navigateTo('/AddDistributor')}>Add Distributor</button></li>
            <li><button className="nav-button" onClick={() => navigateTo('/OrderHistory')}>Order History</button></li>
            <li><button className="nav-button" onClick={() => navigateTo('/DistributorList')}>Distributor List</button></li>
            <li><button className="nav-button" onClick={() => navigateTo('/CreateNewOrder')}>Create New Order</button></li>
          </ul>
        </nav>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
      <div className="content">
        {/* Add your main content here */}
      </div>
      <img src={picture} alt="Picture" className="picture" />
    </div>
  );
};

export default Home;
