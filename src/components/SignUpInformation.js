// components/SignUpInformation.js
import React, { useState } from 'react';
import '../styles/Signup.css'; // Import the stylesheet
import logo from '../assets/logo1.png';
import PersonalDetails from './PersonalDetails';
import { Button, message, Steps } from 'antd';
import BusinessDetails from './BusinessDetails';
import SetupAccount from './SetupAccount';


const SignUpInformation = ({
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  address,
  setAddress,
  zipCode,
  setZipCode,
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
  gstNumber,
  setGSTNumber,
  taxFile,
  setTaxFile,
  businessContact,
  setBusinessContact,
  businessCity,
  setBusinessCity,
  businessPostalCode,
  setBusinessPostalCode,
  businessProvince,
  setBusinessProvince,
  role,
  setRole,
  onSignupClick,
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
        zipCode={zipCode}
        setZipCode={setZipCode}
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
        gstNumber={gstNumber}
        setGSTNumber={setGSTNumber}
        taxFile={taxFile}
        setTaxFile={setTaxFile}
        businessContact={businessContact}
        setBusinessContact={setBusinessContact}
        businessCity={businessCity}
        setBusinessCity={setBusinessCity}
        businessPostalCode={businessPostalCode}
        setBusinessPostalCode={setBusinessPostalCode}
        businessProvince={businessProvince}
        setBusinessProvince={setBusinessProvince}
      />,
    },
    {
      title: 'Setup Account',
      content: <SetupAccount
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        role={role}
        setRole={setRole}
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
            <Button type="primary" style={{ width: '100px', height: '40px' }} onClick={onSignupClick}>
              Create
            </Button>
          )}

        </div>
      </div>
    </div>

  );
};

export default SignUpInformation;
