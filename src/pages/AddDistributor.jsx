// AddDistributor.jsx
import '../styles/AddDistributor.css';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../firebase/firebaseAuth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from "../firebase/firebaseConfig";
import 'bootstrap/dist/css/bootstrap.min.css';
import { collection, addDoc } from 'firebase/firestore';
import MainNavBar from '../components/MainNavBar';

const AddDistributor = () => {

  const distributorOptions = ['Distributor A', 'Distributor B', 'Distributor C', 'Distributor D', 'Distributor E'];
  const [selectedDistributor, setSelectedDistributor] = useState(distributorOptions[0]);
  const { currentUser } = useAuth();
  const [userInfo, setUserInfo] = useState({
    fullName: '',
    address: '',
    contactNumber: '',
    storeName: '',
    storeNumber: '',
    storeAddress: ''
  });
  const [distributors, setDistributors] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser?.uid) {
        try {
          const userRef = doc(db, 'Users', currentUser.uid);
          const docSnap = await getDoc(userRef);

          if (docSnap.exists()) {
            const userData = docSnap.data();
            const fullName = `${userData.firstName} ${userData.lastName}`;
            const firstStoreId = userData.storesList?.length > 0 ? userData.storesList[0] : null;
            let storeName = '';
            let storeNumber = '';
            let storeAddress = '';

            if (firstStoreId) {
              const storeRef = doc(db, 'Retail Stores', firstStoreId);
              const storeSnap = await getDoc(storeRef);
              if (storeSnap.exists()) {
                storeName = storeSnap.data().storeName;
                storeNumber = storeSnap.data().businessNumber;
                storeAddress = storeSnap.data().storeAddress;
              }
            }

            setUserInfo({
              fullName,
              address: `${userData.address}, ${userData.city}, ${userData.province}, ${userData.postalCode}`,
              contactNumber: userData.contactNumber,
              storeName,
              storeNumber,
              storeAddress
            });
          } else {
            setError('No user data found.');
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
          setError("Failed to load user data.");
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleAddDistributor = async () => {
    if (distributors.some(distributor => distributor.name === selectedDistributor)) {
      alert('This distributor has already been added.');
      return;
    }

    // Add distributor to Firestore
    try {
      const docRef = await addDoc(collection(db, "distributors"), {
        name: selectedDistributor,
        // Add the userInfo object instead of just the user ID
        userInfo: {
          fullName: userInfo.fullName,
          address: userInfo.address,
          contactNumber: userInfo.contactNumber,
          storeName: userInfo.storeName,
          storeNumber: userInfo.storeNumber,
          storeAddress: userInfo.storeAddress,
        },
        status: 'Waiting'
      });
      console.log("Document written with ID: ", docRef.id);
      // Update local state
      setDistributors([...distributors, { id: docRef.id, name: selectedDistributor, status: 'Waiting' }]);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div>
      <MainNavBar />
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
                <p><strong>Name:</strong> {userInfo.fullName}</p>
              </div>

              {/* Business Name */}
              <div className="mb-3">
                <p><strong>Address:</strong> {userInfo.address}</p>
              </div>

              {/* Business Address */}
              <div className="mb-3">
                <p><strong>Contact Number:</strong> {userInfo.contactNumber}</p>
              </div>

              <div className="mb-3">
                <p><strong>Store Name:</strong> {userInfo.storeName}</p>
              </div>

              <div className="mb-3">
                <p><strong>Store Number:</strong> {userInfo.storeNumber}</p>
              </div>

              <div className="mb-3">
                <p><strong>Store Address:</strong> {userInfo.storeAddress}</p>

              </div>

              <div className="d-grid gap-2 addButtonLocation">
                <button className="btn btn-primary" type="button" onClick={handleAddDistributor}>ADD</button>
              </div>
            </form>
          </div>

          <div className="col-md-6">
            <div className="list-group">
              {distributors.map((distributor, index) => (
                <div key={index} className="list-group-item d-flex justify-content-between align-items-center" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{distributor.name}</span>
                  <span className="badge bg-warning text-dark" style={{ marginLeft: 'auto' }}>Waiting</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};
export default AddDistributor;
