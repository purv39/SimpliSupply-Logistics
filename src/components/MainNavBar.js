import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../firebase/firebaseAuth';
import { FetchDistributorDataByID, FetchStoreDataByID } from '../firebase/firebaseFirestore';
import '../styles/MainNavBar.css';

const MainNavBar = ({ reloadNavbar }) => {
  const navigate = useNavigate();
  const { LogOut, currentUser, setCurrentUser } = useAuth();
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
      if (currentUser.currentRole === 'Store') {
        const fetchedData = await Promise.all(currentUser.storesList.map(option => FetchStoreDataByID(option)));
        setStoresData(fetchedData);
      } else if (currentUser.currentRole === 'Distributor') {
        const fetchedData = await Promise.all(currentUser.storesList.map(option => FetchDistributorDataByID(option)));
        setStoresData(fetchedData);
      }
    }
    fetchStoresData();
  }, [currentUser.storesList, currentUser.currentRole]);

  const handleStoreChange = (e) => {
    const selectedStore = e.target.value;
    setCurrentUser(prevUser => ({
      ...prevUser,
      selectedStore: selectedStore
    }));
    sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
  };

  // State to manage sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="main-container">
      {/* Icon to toggle sidebar */}
      <div className="sidebar-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        {isSidebarOpen ? <span>&#x25C0;</span> : <span>&#x25B6;</span>}
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="logo" onClick={() => {
          if (role === 'Store') {
            navigateTo('/StoreHome')
          } else {
            navigateTo('/DistributorHome')
          }
        }}>SimpliSupply Logistics</div>
        <nav className="nav-menu">
          <ul>
            {role === 'Store' && (
              <>
                <li><button className="nav-button" onClick={() => navigateTo('/AddDistributor')}>Add Distributor</button></li>
                <li><button className="nav-button" onClick={() => navigateTo('/CreateNewOrder')}>Create New Order</button></li>
                <li><button className="nav-button" onClick={() => navigateTo('/DistributorList')}>Distributor List</button></li>
                <li><button className="nav-button" onClick={() => navigateTo('/OrderHistory')}>Order History</button></li>
                <li><button className="nav-button" onClick={() => navigateTo('/Addstore')}>Add Store</button></li>
                <li><button className="nav-button" onClick={() => navigateTo('/RemoveStore')}>Remove Store</button></li>
                <li><button className="nav-button" onClick={() => navigateTo('/CompareProducts')}>Compare Products</button></li>
                <li><button className="nav-button" onClick={() => navigateTo('/GenerateSkuLabel')}>Generate SKU Label</button></li>
              </>
            )}
            {role === 'Distributor' && (
              <>
                <li><button className="nav-button" onClick={() => navigateTo('/AddProducts')}>Add Products</button></li>
                <li><button className="nav-button" onClick={() => navigateTo('/Invitations')}>Invitations</button></li>
                <li><button className="nav-button" onClick={() => navigateTo('/ShipmentHistory')}>Shipment History</button></li>
                <li><button className="nav-button" onClick={() => navigateTo('/AddDistributionStore')}>Add Distribution Center</button></li>
              </>
            )}
          </ul>
        </nav>
        <div className="dropdown-container">
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
        <div className="user-actions">
          <button className="nav-button my-page" onClick={() => navigateTo('/Welcome')}>My Page</button>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  )
}

export default MainNavBar;