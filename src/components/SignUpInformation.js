// components/SignUpInformation.js
import React from 'react';
import '../styles/Signup.css'; // Import the stylesheet
import logo from '../assets/logo.png';
import MultiStep from 'react-multistep'
import PersonalInfo from './PersonalInfo';

const SignUpInformation = ({
  email,
  setEmail,
  password,
  setPassword,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  address,
  setAddress,
  contactNumber,
  setContactNumber,
  city,
  setCity,
  province,
  setProvince,
  businessName,
  setBusinessName,
  businessAddress,
  setBusinessAddress,
  businessNumber,
  setBusinessNumber,
  onSignupClick
}) => {
  return (
    <div>

      <div className="signup-form">
        <img src={logo} alt='logo' />

        <h2>Signup Information</h2>
        <MultiStep activeStep={0} >
          <PersonalInfo title="Personal Info"/>
          <PersonalInfo title="Business Info"/>
          <PersonalInfo title="Create Account"/>

        </MultiStep>
        {/* <div className="form-group">
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div className="form-group">
        <label>First Name:</label>
        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Last Name:</label>
        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Address:</label>
        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Contact Number:</label>
        <input type="tel" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} />
      </div>
      <div className="form-group">
        <label>City:</label>
        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Province:</label>
        <input type="text" value={province} onChange={(e) => setProvince(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Business Name:</label>
        <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Business Address:</label>
        <input type="text" value={businessAddress} onChange={(e) => setBusinessAddress(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Business Number (BIN):</label>
        <input type="text" value={businessNumber} onChange={(e) => setBusinessNumber(e.target.value)} />
      </div> */}
        <div>
          <button className="register-button" onClick={onSignupClick}>
            Signup
          </button>
        </div>
      </div>
    </div>

  );
};

export default SignUpInformation;
