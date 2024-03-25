import React, { useState, useEffect } from 'react';
import { RemoveStorebyId } from '../firebase/firebaseFirestore';
import { useAuth } from '../firebase/firebaseAuth';
import MainNavBar from "../components/MainNavBar";
import "../styles/LoadingSpinner.css";
import '../styles/DistributorList.css';



import { FetchDistributorDataByID, FetchStoreDataByID } from '../firebase/firebaseFirestore';


const RemoveStore = () => {
    const { LogOut, currentUser, setCurrentUser } = useAuth();

  const [storesData, setStoresData] = useState([]);
  useEffect(() => {
    async function fetchStoresData() {
      if (currentUser.currentRole === 'Store') {
        const fetchedData = await Promise.all(currentUser.storesList.map(option => FetchStoreDataByID(option)));
        setStoresData(fetchedData);
      } else if (currentUser.currentRole === 'Distributor') {
        const fetchedData = await Promise.all(currentUser.storesList.map(option => FetchDistributorDataByID(option)));
        setStoresData(fetchedData);
      }
    }
    fetchStoresData();
  }, [currentUser.storesList]);

  const handleRemoveStore = async (storeIdToRemove) => {
    const removestore = await RemoveStorebyId(storeIdToRemove,currentUser.user.uid)
    setCurrentUser(prevUser => ({
      ...prevUser,
      storesList: prevUser.storesList.filter(storeId => storeId !== storeIdToRemove)
    }));
  };

  return (
    <div>
    <MainNavBar />
    <div className="row justify-content-center">
      <div className="col-md-10">
    <div>
      <h2>Remove Store</h2>
      <table className='table'>
        <thead>
          <tr>
            {/* <th>Store ID</th> */}
            <th>Store Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {storesData.map((storeName, index) => (
            <tr key={index}>
              {/* <td>{currentUser.storesList[index]}</td> */}
              <td>{storeName}</td>
              <td>
                <button variant="contained" color="error"  onClick={() => handleRemoveStore(currentUser.storesList[index])}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
    </div>
    </div>
  );
};

export default RemoveStore;
