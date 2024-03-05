import React, { useState, useEffect } from 'react';
import { useAuth } from '../firebase/firebaseAuth';
import 'bootstrap/dist/css/bootstrap.min.css';
import MainNavBar from '../components/MainNavBar';
import { TableContainer, Table, TableBody, TableRow, TableCell, Paper } from '@mui/material';
import Button from '@mui/material/Button';
import { FetchDistributorStore, FetchDistributionStoreDetails, AddInvitation, CheckForExistingInvitation } from "../firebase/firebaseFirestore"; // Make sure to implement this function
import '../styles/AddDistributor.css';
import { RiseLoader } from 'react-spinners';
import { message } from 'antd';

const AddDistributor = () => {
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [distributorOptions, setDistributorOptions] = useState([]);
  const [selectedDistributor, setSelectedDistributor] = useState('');

  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDistributors = async () => {
      try {
        const stores = await FetchDistributorStore();
        setDistributorOptions(stores);
      } catch (error) {
        console.error("Error fetching distribution stores:", error);
        setError(error.message);
      }
      setLoading(false);
    };
  
    fetchDistributors();
  }, []);

  const handleDistributorChange = async (event) => {
    const storeId = event.target.value;
    setSelectedDistributor(storeId);
    setLoading(true);
    try {
      const storeDetails = await FetchDistributionStoreDetails(storeId);
      console.log("Store details fetched: ", storeDetails);

      if (storeDetails) {
        setUserInfo({
          ...storeDetails,
          name: storeDetails.storeName,
          address: storeDetails.storeAddress,
          businessNumber: storeDetails.businessNumber,
        });
      } else {
        setUserInfo(null);
        setError('Distributor details not found.');
      }
    } catch (error) {
      console.error("Error fetching distribution store details:", error);
      setError(error.message);
      setUserInfo(null);
    }
    setLoading(false);
  };
  const formatAddress = (userInfo) => {
    return userInfo ? `${userInfo.storeAddress}, ${userInfo.storeCity}, ${userInfo.storeProvince}, ${userInfo.storePostalCode}` : '';
  };

  const handleAddDistributor = async () => {
    if (!selectedDistributor) {
      message.error('Please select a distributor.');
      return;
    }
    const distributionID = selectedDistributor;
    const retailStoreID = currentUser.storesList[0];
    try {

      const existingInvitation = await CheckForExistingInvitation(selectedDistributor, retailStoreID);
      if (existingInvitation) {
        message.error("It has already been requested.");
        return;
      }

      // If no existing invitation, proceed to create a new one
      const invitationID = await AddInvitation(distributionID, retailStoreID);
      console.log("Invitation created with ID:", invitationID);

      message.success('Invitation Sent Successfully!!');

    } catch (error) {
      console.error("Error creating invitation:", error);
      message.error("Error creating invitation: " + error);
    }
  };

  return (
    <div>
    <MainNavBar />
    <h2 className="text-center mb-4">Add Distributor</h2>
    {loading ? (
      <div className="loading-spinner">
        <RiseLoader color="#36D7B7" loading={loading} size={10} />
      </div>
    ) : error ? (
      <p>Error: {error}</p>
    ) : (
      <div className="distributor-invitation-container">
        <div className="distributor-table-container">
          <TableContainer component={Paper} className="tableContainer">
            <Table aria-label="distributor selection table">
              <TableBody>
                <TableRow>
                  <TableCell>Select Distributor</TableCell>
                  <TableCell align="right">
                    <select
                      value={selectedDistributor}
                      onChange={handleDistributorChange}
                      className="select-dropdown"
                    >
                      <option value="" disabled>
                        ----------- Select Distributor -----------
                      </option>
                      {distributorOptions.map((distributor) => (
                        <option key={distributor.id} value={distributor.id}>
                          {distributor.storeName}
                        </option>
                      ))}
                    </select>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          
          {userInfo && (
            <TableContainer component={Paper} className="tableContainer">
              <Table aria-label="user information table">
                <TableBody>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">{userInfo.storeName}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Address</TableCell>
                    <TableCell align="right">{formatAddress(userInfo)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Business Number</TableCell>
                    <TableCell align="right">{userInfo.businessNumber}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
          
          <div className="addButtonContainer">
            <Button variant="contained" color="primary" onClick={handleAddDistributor}>
              Add Distributor
            </Button>
          </div>
        </div>

      </div>
    )}
  </div>
  );
};

export default AddDistributor;
