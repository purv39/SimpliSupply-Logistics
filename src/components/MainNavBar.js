import '../styles/MainNavBar.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../firebase/firebaseAuth';
import { FetchDistributorDataByID, FetchStoreDataByID } from '../firebase/firebaseFirestore';
import MenuIcon from '@mui/icons-material/Menu';

const MainNavBar = ({ reloadNavbar }) => {
  const navigate = useNavigate();
  const { LogOut, currentUser, setCurrentUser } = useAuth(); // Assuming setCurrentUser is a function to update currentUser state
  const role = currentUser.currentRole;
  const [menuOpen, setMenuOpen] = useState(false); // State to manage menu visibility
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
    setMenuOpen(false); // Close the menu after navigation
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
      <button className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        <MenuIcon />
      </button>
      <div className={`menu ${menuOpen ? 'open' : ''}`}>
        <nav>
          <ul>
            {role === 'Store' && (
              <>
                <li><button onClick={() => navigateTo('/AddDistributor')}>Add Distributor</button></li>
                <li><button onClick={() => navigateTo('/CreateNewOrder')}>Create New Order</button></li>
                <li><button onClick={() => navigateTo('/DistributorList')}>Distributor List</button></li>
                <li><button onClick={() => navigateTo('/OrderHistory')}>Order History</button></li>
                <li><button onClick={() => navigateTo('/Addstore')}>Add Store</button></li>
                <li><button onClick={() => navigateTo('/RemoveStore')}>Remove Store</button></li>
                <li><button onClick={() => navigateTo('/CompareProducts')}>Compare Products</button></li>
                <li><button onClick={() => navigateTo('/GenerateSkuLabel')}>Generate SKU Label</button></li>
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
        <div className="menu-footer">
          <button className="nav-button my-page" onClick={() => navigateTo('/Welcome')}>My Page</button>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  )
}

export default MainNavBar;
