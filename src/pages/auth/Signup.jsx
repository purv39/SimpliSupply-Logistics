// components/Signup.js
import React, { useState } from 'react';
import { useAuth } from '../../firebase/firebaseAuth';
import { useNavigate } from 'react-router-dom';
import { AddNewUserToFirestore } from '../../firebase/firebaseFirestore';
import SignUpInformation from '../../components/SignUpInformation';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [address, setAddress] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [businessNumber, setBusinessNumber] = useState('');
  const [gstNumber, setGSTNumber] = useState('');
  const [taxFile, setTaxFile] = useState('');
  const [businessContact, setBusinessContact] = useState('');
  const [businessCity, setBusinessCity] = useState('');
  const [businessPostalCode, setBusinessPostalCode] = useState('');
  const [businessProvince, setBusinessProvince] = useState('');
  const [role, setRole] = useState('');



  const { SignUp } = useAuth();

  const navigate = useNavigate();

  const handleSignup = async () => {
    try {

      // Use Firebase auth to create a new user
      const uuid = await SignUp(email, password);
      console.log(uuid);
      AddNewUserToFirestore(uuid, email, firstName, lastName, contactNumber, address, city, zipCode, province, role);
      
      navigate('/home');
      // Redirect or handle successful signup
    } catch (error) {
      // Handle signup error

      console.error('Signup failed:', error.message);
    }
  };

  return (
    <div style={{ backgroundColor: '#eaf9f5' }} >
      <div className='container'>
        <div className="item image-container">
        </div>
        <div className="item register-container">
          <SignUpInformation
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
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
            role={role}
            setRole={setRole}
            onSignupClick={handleSignup}
          />
        </div>

      </div>
    </div>

  );
};

export default Signup;
