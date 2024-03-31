import React, { useState } from 'react';
import { useAuth } from '../firebase/firebaseAuth';
import { useNavigate } from 'react-router-dom';
import { AddNewDistributionStoreForOperator, AddNewStoreForOperator } from '../firebase/firebaseFirestore';
import { Button, message } from 'antd';
import MainNavBar from "../components/MainNavBar";
import BusinessDetails from "../components/BusinessDetails";

const AddStore = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [businessNumber, setBusinessNumber] = useState('');
  const [gstNumber, setGSTNumber] = useState('');
  const [taxFile, setTaxFile] = useState('');
  const [businessContact, setBusinessContact] = useState('');
  const [businessCity, setBusinessCity] = useState('');
  const [businessPostalCode, setBusinessPostalCode] = useState('');
  const [businessProvince, setBusinessProvince] = useState('');

  const reloadNavbar = () => {
    // Force re-render MainNavBar by updating state
    setKey((prevKey) => prevKey + 1);
  };

  const [key, setKey] = useState(0);

  const handleStore = async () => {
    try {
      // Validate input fields before adding a new store
      if (!businessName || !businessAddress || !businessNumber || !gstNumber || !businessContact || !businessCity || !businessPostalCode || !businessProvince) {
        message.error('Please fill in all required fields before adding a new store.');
        return;
      }

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


      const uuid = currentUser.user.uid;

      let addStoreFunction;
      if (currentUser.currentRole === "Store") {
        addStoreFunction = AddNewStoreForOperator;
      } else if (currentUser.currentRole === "Distributor") {
        addStoreFunction = AddNewDistributionStoreForOperator;
      }

      const storeId = await addStoreFunction(uuid, businessName, businessNumber, gstNumber, taxFile, businessContact, businessAddress, businessCity, businessPostalCode, businessProvince);
      setCurrentUser(prevUser => ({
        ...prevUser,
        storesList: [...prevUser.storesList, storeId]
      }));
      sessionStorage.setItem('currentUser', JSON.stringify(currentUser));

      message.success("New Store has been Added")
      setBusinessName('');
      setBusinessAddress('');
      setBusinessNumber('');
      setGSTNumber('');
      setTaxFile(null);
      setBusinessContact('');
      setBusinessCity('');
      setBusinessPostalCode('');
      setBusinessProvince('');
      // Reload the navbar
      reloadNavbar();
      if (currentUser.currentRole === "Distributor") {
        navigate('/DistributorHome');
      } else if (currentUser.currentRole === "Store") {
        navigate('/StoreHome');
      }
    } catch (error) {
      message.error('store add  failed: ' + error.message);
    }
  };

  return (
    <div>
      <MainNavBar key={key} reloadNavbar={reloadNavbar} />
      <div className="row justify-content-center">
        <div className="col-md-6">
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
          <div className="d-grid gap-2 mt-3">
            <Button type="primary" style={{marginBottom: 30}} onClick={handleStore}>ADD</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStore;
