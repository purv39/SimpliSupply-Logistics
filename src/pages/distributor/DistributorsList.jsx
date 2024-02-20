import React, { useState, useEffect } from 'react';
import { db } from "../../firebase/firebaseConfig";
import { collection, getDocs, getDoc, deleteDoc, doc } from 'firebase/firestore'; 
import 'bootstrap/dist/css/bootstrap.min.css';

const DistributorsList = () => {
  const [distributors, setDistributors] = useState([]);
  const [selectedDistributor, setSelectedDistributor] = useState(null);
  const [userInfo, setUserInfo] = useState({
    fullName: '',
    address: '',
    contactNumber: '',
    storeName: '', 
    storeNumber: '',
    storeAddress: ''
  });



  useEffect(() => {
    const fetchDistributors = async () => {
        const querySnapshot = await getDocs(collection(db, "distributors"));
        const distributorsData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          console.log(data); // Log to see if `userId` is present
          return { id: doc.id, ...data };
        });
        setDistributors(distributorsData);
      };

    fetchDistributors();
  }, []);

  const handleRemoveDistributor = async (id) => {
    await deleteDoc(doc(db, "distributors", id));
    setDistributors(distributors.filter(distributor => distributor.id !== id));
  };

  const handleSelectDistributor = async (distributor) => {

    if (!distributor.userId) {
        console.error("Selected distributor does not have a userId property.");
        return;
      }
      const userInfoRef = doc(db, "Users", distributor.userId); 
      const userInfoSnap = await getDoc(userInfoRef);
    if (userInfoSnap.exists()) {
      const userData = userInfoSnap.data();
      setUserInfo({
        fullName: `${userData.firstName} ${userData.lastName}`,
        address: `${userData.address}, ${userData.city}, ${userData.province}, ${userData.postalCode}`,
        contactNumber: userData.contactNumber,
        storeName: distributor.storeName, 
        storeNumber: distributor.storeNumber, 
        storeAddress: distributor.storeAddress
      });
    }
    setSelectedDistributor(distributor);
  };

  return (
    <div>
      <h2>Distributors List</h2>
      <ul className="list-group">
        {distributors.map((distributor) => (
          <li key={distributor.id} className="list-group-item d-flex justify-content-between align-items-center">
            {distributor.name}
            <div>
              <button className="btn btn-primary me-2" onClick={() => handleSelectDistributor(distributor)}>View</button>
              <button className="btn btn-danger" onClick={() => handleRemoveDistributor(distributor.id)}>Remove</button>
            </div>
          </li>
        ))}
      </ul>
      {selectedDistributor && (
        <div className="card mt-3">
          <div className="card-body">
            <h5 className="card-title">{selectedDistributor.storeName}</h5>
            <h6 className="card-subtitle mb-2 text-muted">{selectedDistributor.fullName}</h6>
            <p className="card-text">Contact Number: {selectedDistributor.contactNumber}</p>
            <p className="card-text">Store Number: {selectedDistributor.storeNumber}</p>
            <p className="card-text">Store Address: {selectedDistributor.storeAddress}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DistributorsList;
