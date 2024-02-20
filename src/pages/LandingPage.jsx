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
              <h2>About Us</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla accumsan, felis sit amet tempor
                maximus, eros felis tincidunt ante, at fringilla velit ligula nec sem. Duis malesuada, nisl non
                congue tristique, libero odio lacinia mi, non porta nisi sapien vitae leo. Curabitur ultricies
                lacinia eleifend.
              </p>
              <p>
                Proin eu luctus lectus. Fusce dapibus libero a ex tincidunt, eget accumsan felis pharetra.
                Suspendisse tincidunt erat nec magna volutpat scelerisque. Nulla facilisi. Phasellus convallis
                magna id eros cursus, nec tristique lacus tincidunt. In sit amet mi vel nisl bibendum blandit.
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
