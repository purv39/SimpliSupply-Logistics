// LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/LandingPage.css';
import companyLogo from '../assets/logo.png';
import aboutUsImage from '../assets/about-us-image.png';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="logo">SimpliSupply Logistics</div>
        <nav className="navbar">
          <ul>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Signup</Link></li>
            {/* Add other navigation links if needed */}
          </ul>
        </nav>
      </header>
      
      <main className="landing-content">
        <section className="about-us">
          <div className="about-us-image">
            <img src={aboutUsImage} alt="About Us" />
          </div>
          <div className="about-us-text">
            <div className="company-logo">
              <img src={companyLogo} alt="Company Logo" />
            </div>
            <div>
                <h2>About Us</h2> <br/>
                <p>
                    At SimpliSupply Logistics, we are dedicated to revolutionizing the way businesses manage their supply chains. With our innovative platform, we provide seamless solutions for distributors and stores alike, streamlining processes, reducing costs, and improving efficiency. Our goal is to empower businesses of all sizes to thrive in today's dynamic marketplace by offering comprehensive tools and resources tailored to their specific needs.
                </p>
                <p>
                    Our mission is to simplify supply chain management for businesses around the globe. We strive to deliver cutting-edge technology and exceptional services that enable our clients to optimize their operations, drive growth, and achieve success. With a commitment to excellence and continuous innovation, we aim to be the leading provider of logistics solutions, empowering businesses to reach new heights of productivity and profitability. Join us on this journey as we transform the way businesses connect, collaborate, and succeed in the digital age.
                </p>
            </div>
          </div>
        </section>
        {/* Add other sections as needed */}
      </main>
      <footer className="landing-footer">
        {/* Add footer content if needed */}
      </footer>
    </div>
  );
};

export default LandingPage;
