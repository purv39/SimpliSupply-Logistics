import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap
import "../styles/Home.css";
import picture from '../assets/Dashboard.webp'; // Import your logo
import MainNavBar from '../components/MainNavBar';

const Home = () => {
  return (
    <div className="dashboard">
      <MainNavBar />
      <div className="content">
        {/* Add your main content here */}
      </div>
      <img src={picture} alt="Dashboard" className="picture" />
    </div>
  );
};

export default Home;
