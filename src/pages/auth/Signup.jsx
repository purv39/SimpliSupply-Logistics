import React, { useState } from 'react';
import { useAuth } from '../../firebase/firebaseAuth';
import { useNavigate } from 'react-router-dom';
import User from '../../classes/User';
import { AddUserToFirestore } from '../../firebase/firebaseFirestore';
import SignUpInformation from '../../components/SignUpInformation';
const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
  const { SignUp } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      setLoading(true);

      const newUser = new User(email, password, "retailer");

      // Use Firebase auth to create a new user
      await SignUp(newUser);
      await AddUserToFirestore(newUser);

      navigate('/home');
      // Redirect or handle successful signup
    } catch (error) {
      // Handle signup error
      setError(error.message);
      console.error('Signup failed:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (

      <div style={{backgroundColor: '#eaf9f5'}} >
      <div className='container'>
        <div className="item image-container">
          </div>
        <div className="item register-container">
          <SignUpInformation
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
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
            onSignupClick={handleSignup}
          />
        </div>

        </div>
      </div>
  );
};

export default Signup;
