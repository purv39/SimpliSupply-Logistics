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
    // Validate input fields before proceeding to the next step
    const currentStepContent = steps[current].content.props;

    // Check if all required fields are filled
    const isFilled = Object.values(currentStepContent).every(value => value !== '');

    if (isFilled) {
      if (current === 0) {
        if (contactNumber.length !== 10) {
          message.error('Contact number should be 10 digits');
          return;
        }

        // Validate contact number format
        const contactRegex = /^\d{10}$/; // Assuming contact number should be 10 digits
        if (!contactRegex.test(contactNumber)) {
          message.error('Please enter a valid contact number (10 digits)');
          return;
        }

        // Validate postal code format
        const postalCodeRegex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/; // Canadian postal code format
        if (!postalCodeRegex.test(zipCode)) {
          message.error('Please enter a valid Canadian postal code');
          return;
        }
      } else if (current === 1) {
        
        if (businessNumber.length !== 9) {
          message.error('BIN should be 9 digits');
          return;
        }

        // Validate GST/HST number format
        const gstRegex = /^\d{9}[A-Za-z]{2}\d{4}$/; // Assuming GST/HST number format
        if (!gstRegex.test(gstNumber)) {
          message.error('Please enter a valid GST/HST number (9 digits BN followed by program code and a 4-digit reference number)');
          return;
        }
        
        // Validate postal code format
        const postalCodeRegex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/; // Canadian postal code format
        if (!postalCodeRegex.test(businessPostalCode)) {
          message.error('Please enter a valid Canadian Postal Code');
          return;
        }

        // Validate contact number format
        const contactRegex = /^\d{10}$/; // Assuming contact number should be 10 digits
        if (!contactRegex.test(businessContact)) {
          message.error('Please enter a valid contact number (10 digits)');
          return;
        }
      }

      // Proceed to the next step if all validations pass
      setCurrent(current + 1);
    } else {
      message.error('Please fill in all required fields before proceeding.');
    }

  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const steps = [
    {
      title: 'Personal Details',
      content: (
        <PersonalDetails
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
        />
      ),
    },
    {
      title: 'Business Details',
      content: (
        <BusinessDetails
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
        />
      ),
    },
    {
      title: 'Setup Account',
      content: (
        <SetupAccount
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          role={role}
          setRole={setRole}
        />
      ),
    },
  ];

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  return (
    <div>
      <div className="signup-form">
        <img src={logo} alt="logo" />
        <h2 className="header">Signup Information</h2>
        <Steps current={current} items={items} />
        <div className="form-group">{steps[current].content}</div>
        <div>
          {current > 0 && (
            <Button
              style={{
                margin: '0 10px',
                width: '100px',
                height: '40px',
              }}
              onClick={prev}
            >
              Previous
            </Button>
          )}
          {current < steps.length - 1 && (
            <Button type="primary" style={{ width: '100px', height: '40px' }} onClick={next}>
              Next
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button type="primary" style={{ width: '100px', height: '40px' }} onClick={onSignupClick}>
              Create
            </Button>
          )}
        </div>

        {current === 0 && (
          <div style={{ display: 'flex', width: '100%', justifyContent: 'center', marginTop: '10px' }}>
            Already have an Account?
            <a href="/login" style={{ textDecoration: 'none', marginLeft: '5px' }}>
              Login
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUpInformation;
