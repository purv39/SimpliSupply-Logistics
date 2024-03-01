import React, { useState } from 'react';
import { useAuth } from '../../firebase/firebaseAuth';
import { useNavigate } from 'react-router-dom';
import { AddNewDistributionStoreForOperator, AddNewStoreForOperator, AddNewUserToFirestore } from '../../firebase/firebaseFirestore';
import SignUpInformation from '../../components/SignUpInformation';
import { message } from 'antd';

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
  const [isLoading, setIsLoading] = useState(false);

  const { SignUp, SetCurrentUserDetails } = useAuth();

  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      setIsLoading(true); // Set loading to true while signup process is ongoing

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format validation
      if (!emailRegex.test(email)) {
        message.error('Signup failed: Please enter a valid email address');
        return;
      }

      // Validate password strength
      if (password.length < 8) {
        message.error('Signup failed: Password must be at least 8 characters long');
        return;
      }

      // Confirm password validation
      if (password !== confirmPassword) {
        message.error('Signup failed: Passwords do not match');
        return;
      }

      if(role === '') {
        message.error('Signup failed: Please select a role');
        return;
      }

      // Use Firebase auth to create a new user
      const userCrendentials = await SignUp(email, password);
      const uuid = userCrendentials.user.uid;

      await AddNewUserToFirestore(uuid, email, firstName, lastName, contactNumber, address, city, zipCode, province, role);

      if (role === "Store") {
        await AddNewStoreForOperator(uuid, businessName, businessNumber, gstNumber, taxFile, businessContact, businessAddress, businessCity, businessPostalCode, businessProvince);
      }
      else if (role === "Distributor") {
        await AddNewDistributionStoreForOperator(uuid, businessName, businessNumber, gstNumber, taxFile, businessContact, businessAddress, businessCity, businessPostalCode, businessProvince);
      }
      await SetCurrentUserDetails(userCrendentials, role);

      if(role === 'Store') {
        navigate('/StoreHome');
      } else if (role === 'Distributor') {
        navigate('/DistributorHome');
      }

      setIsLoading(false);

    } catch (error) {
      message.error('Signup failed: ' + error.message);
    }
  };

  return (
    <div style={{ backgroundColor: '#eaf9f5' }} >
      {
        isLoading ? (
          <p>Loading</p>
        ) : (<div className='container'>
        <div className="item image-container"></div>
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
)
      }
          </div>
  );
};

export default Signup;
