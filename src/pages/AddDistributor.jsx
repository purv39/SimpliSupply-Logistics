// AddDistributor.jsx
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../styles/AddDistributor.css";

const AddDistributor = () => {
  const [firstName, setfirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [businessCity, setBusinessCity] = useState('');
  const [businessProvince, setBusinessProvince] = useState('');
  const [businessZipCode, setBusinessZipCode] = useState('');


  const [businessNumber, setBusinessNumber] = useState('');

  const sampleDistributors = [
    { name: 'DistriCo A', confirmed: true },
    { name: 'DistriCo B', confirmed: false },
  ];

  const distributorOptions = ['DistriCo A','DistriCo B', 'DistriCo C', 'DistriCo D', 'DistriCo E'];

  const handleAddDistributor = () => {

    console.log('Added Distributor:', { businessName, businessAddress, businessNumber });
  };

  return (
    <div className="formContainer">
      <h2 className="text-center mb-4">Add Distributor</h2>
      <div className="row">

        <div className="col-md-6">
          <form>

            <label>* required</label>
            <div className="mb-3">
              <label htmlFor="distributorSelect" className="form-label">Select Distributor *</label>
              <select className="form-select" id="distributorSelect" aria-label="Distributor select">
                {distributorOptions.map((option, index) => (
                  <option key={index} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* Owner Name */}
            <div className="mb-3">
              <label htmlFor="firstName" className="form-label">First Name *</label>
              <input type="text" className="form-control" id="firstName" value={firstName} onChange={(e) => setfirstName(e.target.value)} />
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
            {sampleDistributors.map((distributor, index) => (
              <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
                {distributor.name}
                <span className={`badge ${distributor.confirmed ? 'bg-success' : 'bg-warning text-dark'}`}>
                  {distributor.confirmed ? 'Confirmed' : 'Waiting...'}
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
