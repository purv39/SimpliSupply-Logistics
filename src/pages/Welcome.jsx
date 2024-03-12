// components/WelcomePage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../firebase/firebaseAuth';
import { FetchUserData, FetchStoresDetailsByIDs, FetchStoreDetails } from "../firebase/firebaseFirestore";
import MainNavBar from '../components/MainNavBar';
import { RiseLoader } from 'react-spinners';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';



const WelcomePage = () => {
  
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userInfo, setUserInfo] = useState({
    fullName: '',
    email: '',
    contactNumber: '',
    storeName: '',
    businessNumber: '',
    gstNumber: '',
    storeAddress: '',
    profilePic: '', 
    stores: [], 
    selectedStore: '', 
  });
  const [selectedList, setSelectedList] = useState('');

  const formatFullAddress = (address, city, province, postalCode) => {
    return `${address}, ${city}, ${province}, ${postalCode}`;
  };

  useEffect(() => {
    async function fetchUserDataAndStores(uid) {
      setLoading(true);
      try {
        const userData = await FetchUserData(uid);
        const storesList = userData.storesList || [];
        const fullAddress = formatFullAddress(
          userData.address,
          userData.city,
          userData.province,
          userData.postalCode
        );
        
        const storesData = await FetchStoresDetailsByIDs(storesList);
        setUserInfo({
          fullName: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
          contactNumber: userData.contactNumber,
          address: fullAddress,
          stores: storesData,
          selectedStore: storesData.length > 0 ? storesData[0].id : '',
          // You can initialize the rest of the user's store information here if needed.
        });
  
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  
    
    const uid = currentUser?.user?.uid;
    if (uid) {
      fetchUserDataAndStores(uid);
    } else {
      setLoading(false);
      setError('No user ID found');
    }
  }, [currentUser]);
  
  const handleStoreChange = async (event) => {
  const storeId = event.target.value;
  console.log("Selected store ID: ", storeId);
  setSelectedList(storeId); // Update the state to reflect the new selection
  setLoading(true);

  try {
    const storeDetails = await FetchStoreDetails(storeId); // Fetch details for the selected store
    if (storeDetails) {
      console.log("Selected store details: ", storeDetails);
      setUserInfo(prevState => ({
        ...prevState,
        selectedStore: storeId,
        storeName: storeDetails.storeName,
        businessNumber: storeDetails.businessNumber,
        gstNumber: storeDetails.gstNumber,
        storeAddress: `${storeDetails.storeAddress}, ${storeDetails.storeCity}, ${storeDetails.storePostalCode}`,
        // Update additional store details as needed
      }));
    } else {
      console.error('No store details found for the selected ID:', storeId);
      setError('Store details not found.');
    }
  } catch (err) {
    console.error('Error fetching store details:', err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};


  const formatStoreAddress = (storeInfo) => {
    // Here you can format the store address as you like
    return `${storeInfo.storeAddress}, ${storeInfo.storeCity}, ${storeInfo.storePostalCode}`;
  };

  return (
    <div>
      <MainNavBar />
      {loading ? (
        <div className="loading-spinner">
          <RiseLoader color="#36D7B7" loading={loading} size={10} />
        </div>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <Container component="main" maxWidth="sm"> {/* Change maxWidth to 'sm' or any size you prefer */}
          <Typography component="h1" variant="h4" align="center" marginY={4}>
            My Page
          </Typography>
          <Grid container spacing={3} direction="column" alignItems="flex-start"> {/* Align items to flex-start */}
            {/* Separate Grid for Avatar and Name */}
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ padding: 2, display: 'flex', alignItems: 'center' }}>
                <Avatar src={userInfo.profilePic} sx={{ width: 56, height: 56, marginRight: 2 }} />
                <Typography variant="h6">{userInfo.fullName}</Typography>
              </Paper>
            </Grid>
            {/* Grid for Email, Contact Number, and Store Selection */}
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ padding: 2 }}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={userInfo.email}
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{ marginBottom: 1 }} // Adjust spacing as necessary
                />
                <TextField
                  margin="normal"
                  fullWidth
                  id="contactNumber"
                  label="Contact Number"
                  name="contactNumber"
                  autoComplete="tel"
                  value={userInfo.contactNumber}
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{ marginBottom: 1 }} // Adjust spacing as necessary
                />
                <TextField
                  margin="normal"
                  fullWidth
                  id="address"
                  label="Full Address"
                  name="address"
                  value={userInfo.address} // This will now be the full address
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{ marginBottom: 1 }} // Adjust spacing as necessary
                />
                 <select
                      value={selectedList}
                      onChange={handleStoreChange}
                      className="select-dropdown"
                    >
                      <option value="" disabled>
                        ----------- Select List -----------
                      </option>
                      {userInfo.stores.map((store, index) => (
                        <option key={index} value={store.id}>
                          {store.storeName}
                        </option>
                      ))}
                    </select>
              </Paper>
            </Grid>
            {userInfo.selectedStore && (
              <Grid item xs={12}>
                <Paper elevation={3} sx={{ padding: 2 }}>
                  <Typography variant="h6">Store Information</Typography>
                  <Typography><strong>Store Name:</strong> {userInfo.storeName}</Typography>
                  <Typography><strong>Business Number:</strong> {userInfo.businessNumber}</Typography>
                  <Typography><strong>GST Number:</strong> {userInfo.gstNumber}</Typography>
                  <Typography><strong>Store Address:</strong> {userInfo.storeAddress}</Typography>
                  {/* Add edit button if needed */}
                </Paper>
              </Grid>
            )}
          </Grid>
        </Container>
      )}
    </div>
  );
};

export default WelcomePage;
