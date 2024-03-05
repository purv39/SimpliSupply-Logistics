import React, { useState, useEffect } from 'react';
import { useAuth } from '../../firebase/firebaseAuth';
import { Checkbox, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Chip, Button } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import MainNavBar from '../../components/MainNavBar';
import { DisconnectDistributorStore, FetchAllDistributorsForStore, FetchDistributionStoreDetails, FetchInvitationsForStore, RemoveInvitation } from "../../firebase/firebaseFirestore";
import '../../styles/DistributorList.css';
import { RiseLoader } from 'react-spinners'; // Import RingLoader from react-spinners
import "../../styles/LoadingSpinner.css";

const DistributorsList = () => {
  const { currentUser } = useAuth();
  const [connectedDistributors, setConnectedDistributors] = useState([]);
  const [selectedDistributors, setSelecteDistributors] = useState({});
  const [loading, setLoading] = useState(false);
  const storeID = currentUser.selectedStore;


  const FetchConnectedDistributors = async (storeID) => {
    setLoading(true);
    const distributorData = await FetchAllDistributorsForStore(storeID);
    setConnectedDistributors(distributorData);
    setLoading(false); // Set loading to false when data is fetched
  };

  useEffect(() => {
    FetchConnectedDistributors(storeID);
  }, [storeID])

  const handleSelectDistributor = (invitationId) => {
    setSelecteDistributors(prevSelectedInvitations => ({
      ...prevSelectedInvitations,
      [invitationId]: !prevSelectedInvitations[invitationId]
    }));
  };

  const handleRemoveSelected = async () => {
    const selectedIds = Object.keys(selectedDistributors).filter(id => selectedDistributors[id]);
    if (selectedIds.length === 0) {
      alert('Please select at least one invitation to remove.');
      return;
    }
    try {
      await Promise.all(selectedIds.map(id => DisconnectDistributorStore(storeID, id)));
      setConnectedDistributors(connectedDistributors.filter(distributor => !selectedIds.includes(distributor.id)));
      setSelecteDistributors({}); // Reset the selected invitations
      alert('Selected invitations have been successfully removed.');
    } catch (error) {
      console.error('Error removing selected invitations:', error);
      alert('Failed to remove selected invitations. Please try again.');
    }
  };


  return (
    <div>
      <MainNavBar />
      <h2>Distributors List</h2>
      {loading ? ( // Render loading spinner if loading is true
        <div className="loading-spinner">
          <RiseLoader color="#36D7B7" loading={loading} size={10} />
        </div>
      ) : (
        <div>
          <TableContainer component={Paper} className="tableContainer">
            <Table aria-label="invitations table">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox"></TableCell>
                  <TableCell>Distributor</TableCell>
                  <TableCell align="right">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {connectedDistributors?.length > 0 ? connectedDistributors.map((distributor) => (
                  <TableRow key={distributor.id} selected={selectedDistributors[distributor.id]}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={!!selectedDistributors[distributor.id]}
                        onChange={() => handleSelectDistributor(distributor.id)}
                      />
                    </TableCell>
                    <TableCell>{distributor?.data?.storeName || 'Unknown Distributor'}</TableCell>
                    <TableCell align="right">
                      <Chip label="Connected" color="primary" variant="outlined" />
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={3}>No Distributors found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <div className="removeButtonContainer">
            <Button variant="contained" color="error" onClick={handleRemoveSelected}>
              Remove
            </Button>
          </div>
        </div>
      )
      }
    </div>
  );
};

export default DistributorsList;
