import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../firebase/firebaseAuth';
import { FetchDistributorDataByID, FetchStoreDataByID } from '../firebase/firebaseFirestore';

const MainNavBar = ({ reloadNavbar }) => {
  const navigate = useNavigate();
  const { LogOut, currentUser, setCurrentUser } = useAuth(); // Assuming setCurrentUser is a function to update currentUser state
  const role = currentUser.currentRole;

  const navigateTo = (path) => {
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      await LogOut();
      navigate('/');
      console.log("Logged out successfully");
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  };

  const [storesData, setStoresData] = useState([]);
  useEffect(() => {
    async function fetchStoresData() {
      if(currentUser.currentRole === 'Store') {
        const fetchedData = await Promise.all(currentUser.storesList.map(option => FetchStoreDataByID(option)));
        setStoresData(fetchedData);
      } else if (currentUser.currentRole === 'Distributor') {
        const fetchedData = await Promise.all(currentUser.storesList.map(option => FetchDistributorDataByID(option)));
        setStoresData(fetchedData);
      }
    }
    fetchStoresData();
  }, [currentUser.storesList]);

  const handleStoreChange = (e) => {
    const selectedStore = e.target.value;
    setCurrentUser(prevUser => ({
      ...prevUser,
      selectedStore: selectedStore
    }));
    sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
  };

  return (
    <div className="navbar">
      <div className="logo" onClick={() => {
        if (role === 'Store') {
          navigateTo('/StoreHome')
        } else {
          navigateTo('/DistributorHome')
        }
      }}>SimpliSupply Logistics</div>
      <nav>
        <ul>
          {role === 'Store' && <li><button className="nav-button" onClick={() => navigateTo('/AddDistributor')}>Add Distributor</button></li>}
          {role === 'Store' && <li><button className="nav-button" onClick={() => navigateTo('/CreateNewOrder')}>Create New Order</button></li>}
          {role === 'Store' && <li><button className="nav-button" onClick={() => navigateTo('/DistributorList')}>Distributor List</button></li>}
          {role === 'Store' && <li><button className="nav-button" onClick={() => navigateTo('/OrderHistory')}>Order History</button></li>}
          {role === 'Store' && <li><button className="nav-button" onClick={() => navigateTo('/Addstore')}>Add Store</button></li>}
        </ul>
      </nav>
      <nav>
        <ul>
          {role === 'Distributor' && <li><button className="nav-button" onClick={() => navigateTo('/AddProducts')}>Add Products</button></li>}
          {role === 'Distributor' && <li><button className="nav-button" onClick={() => navigateTo('/Invitations')}>Invitations</button></li>}
          {role === 'Distributor' && <li><button className="nav-button" onClick={() => navigateTo('/ShipmentHistory')}>Shipment History</button></li>}
        </ul>
      </nav>
      <div className="mb-3">
        <select
          className="form-select"
          id="storeSelect"
          value={currentUser.selectedStore}
          onChange={handleStoreChange}
        >
          {storesData.map((storeName, index) => (
            <option key={index} value={currentUser.storesList[index]}>{storeName}</option>
          ))}
        </select>
      </div>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default MainNavBar;
