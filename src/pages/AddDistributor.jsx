// AddDistributor.jsx
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../styles/AddDistributor.css";

const AddDistributor = () => {

 
  const distributorOptions = ['DistriCo A', 'DistriCo B', 'DistriCo C', 'DistriCo D', 'DistriCo E'];


  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [businessCity, setBusinessCity] = useState('');
  const [businessProvince, setBusinessProvince] = useState('');
  const [businessZipCode, setBusinessZipCode] = useState('');
  const [businessNumber, setBusinessNumber] = useState('');

  const [error, setError] = useState('');
  const [distributors, setDistributors] = useState([]);
  const [selectedDistributor, setSelectedDistributor] = useState(distributorOptions[0]);


 

  const handleAddDistributor = () => {
    setError('');

    if (!firstName || !lastName || !businessName || !businessAddress || !businessCity || !businessProvince || !businessZipCode || !businessNumber) {
      setError('The required requirements were not met.');
      return;
    }

    if (distributors.some(d => d.name === selectedDistributor)) {
      alert('The distributor you have already applied for');
      return;
    }

    // Correctly set the name of the new distributor
    setDistributors([...distributors, { name: selectedDistributor, confirmed: 'Waiting...' }]);

    // Clear the form fields after adding
    setFirstName('');
    setLastName('');
    setBusinessName('');
    setBusinessAddress('');
    setBusinessCity('');
    setBusinessProvince('');
    setBusinessZipCode('');
    setBusinessNumber('');
    setSelectedDistributor(distributorOptions[0]); 
    
  };
  

  return (

    

    <div className="formContainer">
      <h2 className="text-center mb-4">Add Distributor</h2>
      <div className="row">

        <div className="col-md-6">
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          <form>
            <label>* required</label>
            <div className="mb-3">
              <label htmlFor="distributorSelect" className="form-label">Select Distributor *</label>
                <select
                  className="form-select"
                  id="distributorSelect"
                  aria-label="Distributor select"
                  value={selectedDistributor}
                  onChange={(e) => setSelectedDistributor(e.target.value)}
                >
                  {distributorOptions.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))}
                </select>
            </div>

            {/* Owner Name */}
            <div className="mb-3">
              <label htmlFor="firstName" className="form-label">First Name *</label>
              <input type="text" className="form-control" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>

            
            <div className="mb-3">
              <label htmlFor="lastName" className="form-label">Last Name *</label>
              <input type="text" className="form-control" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>

            {/* Business Name */}
            <div className="mb-3">
              <label htmlFor="businessName" className="form-label">Store Name *</label>
              <input type="text" className="form-control" id="businessName" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
            </div>

            {/* Business Address */}
            <div className="mb-3">
              <label htmlFor="businessAddress" className="form-label">Address *</label>
              <input type="text" className="form-control" id="businessAddress" value={businessAddress} onChange={(e) => setBusinessAddress(e.target.value)} />
            </div>

            <div className="mb-3">
              <label htmlFor="businessCity" className="form-label">City *</label>
              <input type="text" className="form-control" id="businessCity" value={businessCity} onChange={(e) => setBusinessCity(e.target.value)} />
            </div>

            <div className="mb-3">
              <label htmlFor="businessProvince" className="form-label">Province *</label>
              <input type="text" className="form-control" id="businessProvince" value={businessProvince} onChange={(e) => setBusinessProvince(e.target.value)} />
            </div>

            <div className="mb-3">
              <label htmlFor="businessZipCode" className="form-label">ZipCode *</label>
              <input type="text" className="form-control" id="businessZipCode" value={businessZipCode} onChange={(e) => setBusinessZipCode(e.target.value)} />
            </div>

            {/* Business Number */}
            <div className="mb-3">
              <label htmlFor="businessNumber" className="form-label">Store Number *</label>
              <input type="text" className="form-control" id="businessNumber" value={businessNumber} onChange={(e) => setBusinessNumber(e.target.value)} />
            </div>


            <div className="d-grid gap-2 addButtonLocation">
              <button className="btn btn-primary addButton" type="button" onClick={handleAddDistributor}>ADD</button>
            </div>
          </form>
        </div>

        <div className="col-md-6">
          <div className="list-group">
            {distributors.map((distributor, index) => (
              <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
                {distributor.name} 
                <span className={`badge ${distributor.confirmed === 'Confirmed' ? 'bg-success' : 'bg-warning text-dark'}`}>
                  {distributor.confirmed}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDistributor;
