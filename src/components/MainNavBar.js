import '../styles/MainNavBar.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../firebase/firebaseAuth';
import { FetchDistributorDataByID, FetchStoreDataByID } from '../firebase/firebaseFirestore';
import MenuIcon from '@mui/icons-material/Menu';

const MainNavBar = ({ reloadNavbar }) => {
  const navigate = useNavigate();
  const { LogOut, currentUser, setCurrentUser } = useAuth();
  const role = currentUser.currentRole;
  const [menuOpen, setMenuOpen] = useState(false);
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
  }, [currentUser.storesList, currentUser.currentRole]);

  const handleStoreChange = (e) => {
    const selectedStore = e.target.value;
    setCurrentUser(prevUser => ({
      ...prevUser,
      selectedStore: selectedStore
    }));
    sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
  };

  const navigateTo = (path) => {
    navigate(path);
    setMenuOpen(false);
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

  return (
    <div className="navbar">
      <div className="logo" onClick={() => {
        if (role === 'Store') {
          navigateTo('/StoreHome')
        } else {
          navigateTo('/DistributorHome')
        }
      }}>SimpliSupply Logistics</div>
      <div className="menu" onMouseEnter={() => setMenuOpen(true)} onMouseLeave={() => setMenuOpen(false)}>
        {role === 'Store' && (
          <>
            <div className={`menu-item${menuOpen ? ' open' : ''}`}>
              Distributors
              <div className="dropdown-content">
                <button onClick={() => navigateTo('/AddDistributor')}>Add Distributor</button>
                <button onClick={() => navigateTo('/DistributorList')}>Distributor List</button>
              </div>
            </div>
            <div className={`menu-item${menuOpen ? ' open' : ''}`}>
              Orders
              <div className="dropdown-content">
                <button onClick={() => navigateTo('/CreateNewOrder')}>Create New Order</button>
                <button onClick={() => navigateTo('/OrderHistory')}>Order History</button>
                <button onClick={() => navigateTo('/CompareProducts')}>Compare Products</button>
                <button onClick={() => navigateTo('/GenerateSkuLabel')}>Generate SKU Label</button>
              </div>
            </div>
            <div className={`menu-item${menuOpen ? ' open' : ''}`}>
              Manage Store
              <div className="dropdown-content">
                <button onClick={() => navigateTo('/AddStore')}>Add Store</button>
                <button onClick={() => navigateTo('/RemoveStore')}>Remove Store</button>
              </div>
            </div>
          </>
        )}
        {role === 'Distributor' && (
              <>
                <li><button onClick={() => navigateTo('/AddProducts')}>Add Products</button></li>
                <li><button onClick={() => navigateTo('/Invitations')}>Invitations</button></li>
                <li><button onClick={() => navigateTo('/ShipmentHistory')}>Shipment History</button></li>
                <li><button onClick={() => navigateTo('/AddDistributionStore')}>Add Distribution Center</button></li>
              </>
            )}
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
      <div className="menu-footer">
          <button className="nav-button my-page" onClick={() => navigateTo('/Welcome')}>My Page</button>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  )
}

export default MainNavBar;
