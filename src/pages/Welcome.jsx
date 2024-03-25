// components/WelcomePage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../firebase/firebaseAuth';
import { FetchUserData, FetchStoresDetailsByIDs, FetchDistributionStoreDetails,FetchDistributionStoresDetailsByUID, FetchStoreDetails, UpdateUserData  } from "../firebase/firebaseFirestore";
import MainNavBar from '../components/MainNavBar';
import { RiseLoader } from 'react-spinners';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
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
    roles: { distributor: false, storeOperator: false }, 
  });
  const [selectedList, setSelectedList] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedUserInfo, setEditedUserInfo] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStoreDetails, setSelectedStoreDetails] = useState(null);


  

  const formatFullAddress = (address, city, province, postalCode) => {
    return `${address}, ${city}, ${province}, ${postalCode}`;
  };

  useEffect(() => {
    setEditedUserInfo({
      email: userInfo.email,
      contactNumber: userInfo.contactNumber,
      address: userInfo.address,

    });
  }, [isEditMode, userInfo.address, userInfo.contactNumber, userInfo.email]); 


  useEffect(() => {
    async function fetchUserDataAndStores(uid) {

      if (!currentUser?.user?.uid) {
        setLoading(false);
        setError('No user ID found');
        return;
      }

      setLoading(true);
      try {
        const userData = await FetchUserData(currentUser.user.uid);
        let storeData = [];
        let selectedStoreInfo = {};

        if (userData.roles?.distributor) {
          storeData = await FetchDistributionStoresDetailsByUID(userData.distributionStores || []);
        } else if (userData.roles?.storeOperator) {
          storeData = await FetchStoresDetailsByIDs(userData.storesList || []);
        }

        if (storeData.length > 0) {
          selectedStoreInfo = storeData[0]; // Set the first store as selected by default
        }

        setUserInfo({
          fullName: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
          contactNumber: userData.contactNumber,
          storeName: selectedStoreInfo.storeName || '',
          businessNumber: selectedStoreInfo.businessNumber || '',
          gstNumber: selectedStoreInfo.gstNumber || '',
          address: `${userData.address || ''}, ${userData.city || ''}, ${userData.province || ''}, ${userData.postalCode || ''}`,
          roles: userData.roles,
          profilePic: userData.profilePic || '', 
          stores: storeData,
          selectedStore: selectedStoreInfo.id || '', 
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
    setSelectedList(storeId); 
    setLoading(true);

    try {
      let storeDetails = null;

      if (userInfo.roles && userInfo.roles.distributor)  {
        storeDetails = await FetchDistributionStoreDetails(storeId);
      } else if (userInfo.roles && userInfo.roles.storeOperator) {
        storeDetails = await FetchStoreDetails(storeId);
      }
      if (storeDetails) {
        setSelectedStoreDetails({
          storeName: storeDetails.storeName,
          businessNumber: storeDetails.businessNumber,
          gstNumber: storeDetails.gstNumber,
          storeAddress: formatFullAddress(
            storeDetails.storeAddress,
            storeDetails.storeCity,
            storeDetails.storeProvince,
            storeDetails.storePostalCode
          ),
        });
        console.log("Selected store details: ", storeDetails);
      } else {
        console.error('No store details found for the selected ID:', storeId);
        setSelectedStoreDetails(null);
        setError('Store details not found.');
      }
    } catch (err) {
      console.error('Error fetching store details:', err);
      setError(err.message);
      setSelectedStoreDetails(null);
    } finally {
      setLoading(false);
    }
  };

  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUserInfo({ ...editedUserInfo, [name]: value });
  };

  const handleSave = async () => {
    // Update user data in Firestore
    try {
      await UpdateUserData(currentUser?.user?.uid, editedUserInfo);
      setUserInfo(prevState => ({
        ...prevState,
        ...editedUserInfo,
      }));
      setIsEditMode(false);
      // Refresh user info (you might want to re-fetch the user data from the Firestore)
      // ... Fetch user data code ...
    } catch (error) {
      console.error("Error updating user data:", error);
      setError(error.message);
    }
  };

  const handleEditClick = () => {
    setOpenDialog(true);
    setEditedUserInfo({
      email: userInfo.email,
      contactNumber: userInfo.contactNumber,
      address: userInfo.address.split(', ')[0], // assuming address is the first part of the string
      city: userInfo.address.split(', ')[1],
      province: userInfo.address.split(', ')[2],
      postalCode: userInfo.address.split(', ')[3],
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDialogSave = async () => {
    try {
      await UpdateUserData(currentUser?.user?.uid, editedUserInfo); // Your update function
      setUserInfo(prevState => ({
        ...prevState,
        ...editedUserInfo,
      }));
      handleCloseDialog();
      alert('Save complete!');
    } catch (error) {
      console.error("Error updating user data:", error);
      alert('There was an error saving the changes.');
    }
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
        <Container component="main" maxWidth="lg"> {/* Change maxWidth to 'sm' or any size you prefer */}
          <Typography component="h1" variant="h4" align="center" marginY={4}>
            My Page
          </Typography>
          <Grid container spacing={3} direction="row" alignItems="flex-start"> {/* Align items to flex-start */}
            {/* Separate Grid for Avatar and Name */}
            <Grid item xs={12} >
              <Paper elevation={3} sx={{ padding: 4, display: 'flex', alignItems: 'center' }}>
                <Avatar src={userInfo.profilePic} sx={{ width: 56, height: 56, marginRight: 2 }} />
                <Typography variant="h6">{userInfo.fullName}</Typography>
              </Paper>
            </Grid>
            {/* Grid for Email, Contact Number, and Store Selection */}
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ padding: 2 }}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={isEditMode ? editedUserInfo.email : userInfo.email}
                  InputProps={{
                    readOnly: !isEditMode,
                  }}
                  onChange={handleInputChange}
                  sx={{ marginBottom: 1 }} // Adjust spacing as necessary
                />
                <TextField
                  margin="normal"
                  fullWidth
                  id="contactNumber"
                  label="Contact Number"
                  name="contactNumber"
                  autoComplete="tel"
                  value={isEditMode ? editedUserInfo.contactNumber : userInfo.contactNumber}
                  InputProps={{
                    readOnly: !isEditMode,
                  }}
                  onChange={handleInputChange}
                  sx={{ marginBottom: 1 }} // Adjust spacing as necessary
                />
                <TextField
                  margin="normal"
                  fullWidth
                  id="address"
                  label="Full Address"
                  name="address"
                  value={isEditMode ? editedUserInfo.address : userInfo.address}
                  InputProps={{
                    readOnly: !isEditMode,
                  }}
                  onChange={handleInputChange}
                  sx={{ marginBottom: 1 }} // Adjust spacing as necessary
                />
                 <Box textAlign="right">
                  <Button variant="contained" color="primary" onClick={handleEditClick}>
                    Edit
                  </Button>
                 </Box>
              </Paper>
            </Grid>
            {userInfo.selectedStore && (
              <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ padding: 2 }}>
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
                  {selectedStoreDetails && ( 
                                        <>
                      <Typography variant="h6"> ------ Store Information ------ </Typography>
                      <Typography><strong>Store Name:</strong> {selectedStoreDetails.storeName}</Typography>
                      <Typography><strong>Business Number:</strong> {selectedStoreDetails.businessNumber}</Typography>
                      <Typography><strong>GST Number:</strong> {selectedStoreDetails.gstNumber}</Typography>
                      <Typography><strong>Store Address:</strong> {selectedStoreDetails.storeAddress}</Typography>
                    </>
                  )}
                </Paper>
              </Grid>
            )}
          </Grid>
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>Edit Address Information</DialogTitle>
            <DialogContent>
              <TextField
                margin="normal"
                fullWidth
                label="Email Address"
                name="email"
                value={editedUserInfo.email}
                onChange={handleInputChange}
              />
              <TextField
                margin="normal"
                fullWidth
                label="Contact Number"
                name="contactNumber"
                value={editedUserInfo.contactNumber}
                onChange={handleInputChange}
              />
              <TextField
                margin="normal"
                fullWidth
                label="Address"
                name="address"
                value={editedUserInfo.address}
                onChange={handleInputChange}
              />
              <TextField
                margin="normal"
                fullWidth
                label="City"
                name="city"
                value={editedUserInfo.city}
                onChange={handleInputChange}
              />
              <TextField
                margin="normal"
                fullWidth
                label="Postal Code"
                name="postalCode"
                value={editedUserInfo.postalCode}
                onChange={handleInputChange}
              />
              <TextField
                margin="normal"
                fullWidth
                label="Province"
                name="province"
                value={editedUserInfo.province}
                onChange={handleInputChange}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button onClick={handleDialogSave}>Save</Button>
            </DialogActions>
          </Dialog>
        </Container>
      )}
    </div>
  );
};

export default WelcomePage;
