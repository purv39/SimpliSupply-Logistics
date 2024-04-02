// components/WelcomePage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../firebase/firebaseAuth';
import { FetchDistributorsNamesByIDs, FetchUserData, FetchStoreOwnerByIDs,FetchStoresDetailsByIDs,FetchUserByStoreKey ,FetchUserByDistributorKey , FetchDistributionStoreDetails,FetchDistributionStoresDetailsByUID, FetchStoreDetails, UpdateUserData  } from "../firebase/firebaseFirestore";
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

  const [openDistributorDialog, setOpenDistributorDialog] = useState(false);
  const [distributorDetails, setDistributorDetails] = useState({});


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
      if (userInfo.roles.distributor) {
        storeDetails = await FetchDistributionStoreDetails(storeId);
        if (storeDetails) {
          let storeOwnerInfo= ['No stores']; // Default message if no distributors are connected
          
          if (storeDetails.storesConnected?.length > 0) {
            // Fetch the names of connected distributors
            storeOwnerInfo = await FetchStoreOwnerByIDs(storeDetails.storesConnected);
          }
    
          // Set the state with all the store details including the distributor names
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
            stores: storeOwnerInfo // Use the fetched names
          });
        } else {
          setError('Distributor details not found.');
        }
    

      } else if (userInfo.roles.storeOperator) {
        storeDetails = await FetchStoreDetails(storeId);
        if (storeDetails) {
          let distributorInfo = ['No distributors']; // Default message if no distributors are connected
          
          if (storeDetails.distributorsConnected?.length > 0) {
            // Fetch the names of connected distributors
            distributorInfo = await FetchDistributorsNamesByIDs(storeDetails.distributorsConnected);
          }
    
          // Set the state with all the store details including the distributor names
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
            distributors: distributorInfo // Use the fetched names
          });
        } else {
          setError('Store details not found.');
        }
      }
  
      
    } catch (err) {
      console.error('Error fetching store details:', err);
      setError(err.message);
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

  

  const handleViewDistributor = async (distribytorKey) => {
    setLoading(true);
  try {
    const userDetails = await FetchUserByDistributorKey(distribytorKey);
    setDistributorDetails(userDetails);
    setOpenDistributorDialog(true);
  } catch (error) {
    console.error("Error fetching user details:", error);
    setError(error.message);
  } finally {
    setLoading(false);
  }
  };

  const handleViewStoreOwner = async (storeKey) => {
    console.log("here: " + storeKey);
    setLoading(true);
  try {
    const userDetails = await FetchUserByStoreKey(storeKey);
        console.log("user detail: " + userDetails.contactNumber);

    setDistributorDetails(userDetails);
    setOpenDistributorDialog(true);
  } catch (error) {
    console.error("Error fetching user details:", error);
    setError(error.message);
  } finally {
    setLoading(false);
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
        <Container component="main" maxWidth="lg">
          <Typography component="h1" variant="h4" align="center" marginY={4}>
            My Page
          </Typography>
          <Grid container spacing={3} direction="row" alignItems="flex-start"> 
            {/* Separate Grid for Avatar and Name */}
            <Grid item xs={12} >
              <Paper elevation={3} sx={{ padding: 4, display: 'flex', alignItems: 'center' }}>
                <Avatar src={userInfo.profilePic} sx={{ width: 56, height: 56, marginRight: 2 }} />
                <Typography variant="h6">{userInfo.fullName}</Typography>
              </Paper>
            </Grid>
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
                      ----------- Select Store -----------
                    </option>
                    {userInfo.stores.map((store, index) => (
                      <option key={index} value={store.id}>
                        {store.storeName}
                      </option>
                    ))}
                  </select>
                  {selectedStoreDetails && (
                    <>
                      <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
                        <Typography variant="h6" gutterBottom component="div">
                          Store Information
                        </Typography>
                        <Typography variant="subtitle1">
                          <strong>Store Name:</strong> {selectedStoreDetails.storeName}
                        </Typography>
                        <Typography variant="subtitle1">
                          <strong>Business Number:</strong> {selectedStoreDetails.businessNumber}
                        </Typography>
                        <Typography variant="subtitle1">
                          <strong>GST Number:</strong> {selectedStoreDetails.gstNumber}
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                          <strong>Store Address:</strong> {selectedStoreDetails.storeAddress}
                        </Typography>
                      </Paper>
                      <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
                        <Typography variant="h6" gutterBottom component="div">
                          Connected for
                        </Typography>
                                          
                        {
                          selectedStoreDetails.stores && selectedStoreDetails.stores.length > 0 && (
                            selectedStoreDetails.stores.map((store, index) => (
                              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <Typography variant="subtitle1">
                                  {store.name}
                                </Typography>
                                <Button variant="outlined" size="small" onClick={() => handleViewStoreOwner(store.key)}>
                                  View
                                </Button>
                              </div>
                            ))
                          )
                        }

                      {
                        selectedStoreDetails.distributors && selectedStoreDetails.distributors.length > 0 && (
                          selectedStoreDetails.distributors.map((distributor, index) => (
                            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                              <Typography variant="subtitle1">
                                {distributor.name}
                              </Typography>
                              <Button variant="outlined" size="small" onClick={() => handleViewDistributor(distributor.key)}>
                                View
                              </Button>
                            </div>
                          ))
                        )
                      }
                      </Paper>
                    </>
                  )}
                </Paper>
              </Grid>
            )}

          </Grid>
          <Dialog open={openDistributorDialog} onClose={() => setOpenDistributorDialog(false)}>
            <DialogTitle>Profile</DialogTitle>
            <DialogContent>
              <Typography>Name: {distributorDetails.name}</Typography>
              <Typography>Contact Number: {distributorDetails.contactNumber}</Typography>
              <Typography>Email: {distributorDetails.email}</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDistributorDialog(false)}>Close</Button>
            </DialogActions>
          </Dialog>
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
