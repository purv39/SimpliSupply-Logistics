// components/SignUpInformation.js
import React, { useState } from 'react';
import '../styles/Signup.css'; // Import the stylesheet
import logo from '../assets/logo.png';
import PersonalDetails from './PersonalDetails';
import { Button, message, Steps } from 'antd';
import BusinessDetails from './BusinessDetails';
import SetupAccount from './SetupAccount';


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

  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const steps = [
    {
      title: 'Personal Details',
      content: <PersonalDetails
        firstName={firstName}
        setFirstName={setFirstName}
        lastName={lastName}
        setLastName={setLastName}
        address={address}
        setAddress={setAddress}
        contactNumber={contactNumber}
        setContactNumber={setContactNumber}
        city={city}
        setCity={setCity}
        province={province}
        setProvince={setProvince}
      />,
    },
    {
      title: 'Business Details',
      content: <BusinessDetails
        businessName={businessName}
        setBusinessName={setBusinessName}
        businessAddress={businessAddress}
        setBusinessAddress={setBusinessAddress}
        businessNumber={businessNumber}
        setBusinessNumber={setBusinessNumber}
      />,
    },
    {
      title: 'Setup Account',
      content: <SetupAccount
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
      />,
    },
  ];

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));




  return (
    <div>

      <div className="signup-form">
        <img src={logo} alt='logo' />
        <h2>Signup Information</h2>
        <Steps current={current} items={items} />
        <div className='form-group'>{steps[current].content}</div>
        <div>
          {current > 0 && (
            <Button
              style={{
                margin: '0 10px',
                width: '100px',
                height: '40px'
              }}
              onClick={() => prev()}
            >
              Previous
            </Button>
          )}
          {current < steps.length - 1 && (
            <Button type="primary" style={{ width: '100px', height: '40px' }} onClick={() => next()}>
              Next
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button type="primary" style={{ width: '100px', height: '40px' }} onClick={() => message.success('Processing complete!')}>
              Create
            </Button>
          )}

        </div>
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
        {/* <div>
          <button className="register-button" onClick={onSignupClick}>
            Signup
          </button>
        </div> */}
      </div>
    </div>

  );
};

export default SignUpInformation;
