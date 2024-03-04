import React, { useState } from 'react';
import { useAuth } from '../firebase/firebaseAuth';
import { useNavigate } from 'react-router-dom';
import { AddNewStoreForOperator } from '../firebase/firebaseFirestore';
import { message } from 'antd';
import MainNavBar from "../components/MainNavBar";
import BusinessDetails from "../components/BusinessDetails";
 
const AddStore = () => {
  const { currentUser } = useAuth();
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
      const uuid = currentUser.user.uid;
      const storeId = await AddNewStoreForOperator(uuid, businessName, businessNumber, gstNumber, taxFile, businessContact, businessAddress, businessCity, businessPostalCode, businessProvince);
 
      console.log("storeID:" + storeId);
      currentUser.storesList.push(storeId);
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
     // navigate('/StoreHome');
    } catch (error) {
      message.error('store add  failed: ' + error.message);
    }
  };
 
  return (
<div>
<MainNavBar key={key} reloadNavbar={reloadNavbar} />
<div className='col-4'>
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
<div className="d-grid gap-2 addButtonLocation">
<button className="btn btn-primary" type="button" onClick={handleStore}>ADD</button>
</div>
</div>
</div>
  );
};
 
export default AddStore;