import '../styles/MainNavBar.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../firebase/firebaseAuth';
import { FetchDistributorDataByID, FetchStoreDataByID } from '../firebase/firebaseFirestore';
import MenuIcon from '@mui/icons-material/Menu';
import { Select } from '@mui/material';
const MainNavBar = ({ reloadNavbar }) => {
  const navigate = useNavigate();
  const { LogOut, currentUser, setCurrentUser } = useAuth();
  const role = currentUser.currentRole;
  const [storesData, setStoresData] = useState([]);
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null); // Track the index of the open dropdown

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

  const navigateTo = (path) => {
    navigate(path);
    setOpenDropdownIndex(null); // Close the dropdown when navigating
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

  const handleMouseEnter = (index) => {
    setOpenDropdownIndex(index);
  };

  const handleMouseLeave = () => {
    setOpenDropdownIndex(null);
  };

  return (
    <div className="navbar">
      <div className="logo" >
        <div onClick={() => {
          if (role === 'Store') {
            navigateTo('/StoreHome')
          } else {
            navigateTo('/DistributorHome')
          }
        }}>
          SimpliSupply Logistics
        </div>
        <div className='menu-item'>
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
      </div>

      <div className="menu-footer">
        {role === 'Store' && (
          <>
            <div className="menu-item" onMouseEnter={() => handleMouseEnter(0)} onMouseLeave={handleMouseLeave}>
              <button>Distributors</button>
              {openDropdownIndex === 0 && (
                <div className="dropdown-content">
                  <button onClick={() => navigateTo('/AddDistributor')}>Add Distributor</button>
                  <button onClick={() => navigateTo('/DistributorList')}>Distributor List</button>
                </div>
              )}
            </div>
            <div className="menu-item" onMouseEnter={() => handleMouseEnter(1)} onMouseLeave={handleMouseLeave}>
              <button>Products</button>
              {openDropdownIndex === 1 && (
                <div className="dropdown-content">
                  <button onClick={() => navigateTo('/CreateNewOrder')}>Create New Order</button>
                  <button onClick={() => navigateTo('/OrderHistory')}>Order History</button>
                  <button onClick={() => navigateTo('/CompareProducts')}>Compare Products</button>
                  <button onClick={() => navigateTo('/GenerateSkuLabel')}>Generate SKU Label</button>
                </div>
              )}
            </div>
            <div className="menu-item" onMouseEnter={() => handleMouseEnter(2)} onMouseLeave={handleMouseLeave}>
              <button>Profile</button>
              {openDropdownIndex === 2 && (
                <div className="dropdown-content">
                  <button onClick={() => navigateTo('/AddStore')}>Add Store</button>
                  <button onClick={() => navigateTo('/RemoveStore')}>Remove Store</button>
                  <button onClick={() => navigateTo('/Welcome')}>My Page</button>

                </div>
              )}
            </div>
          </>
        )}
        {role === 'Distributor' && (
          <>
            <div className='menu-item'>
              <button onClick={() => navigateTo('/AddProducts')}>Add Products</button>

            </div>
            <div className='menu-item'>
              <button onClick={() => navigateTo('/Invitations')}>Invitations</button>

            </div>

            <div className='menu-item'>
              <button onClick={() => navigateTo('/ShipmentHistory')}>Shipment History</button>

            </div>

            <div className='menu-item'>
              <button onClick={() => navigateTo('/AddDistributionStore')}>Add Distribution Center</button>

            </div>
            <div className='menu-item'>
              <button onClick={() => navigateTo('/Welcome')}>My Page</button>

            </div>


          </>
        )}



        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>

    </div>
  )
}

export default MainNavBar;
