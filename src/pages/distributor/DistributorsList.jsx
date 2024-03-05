import React, { useState, useEffect } from 'react';
import { useAuth } from '../../firebase/firebaseAuth';
import { Checkbox, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Chip, Button } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import MainNavBar from '../../components/MainNavBar';
import { FetchDistributionStoreDetails, FetchInvitationsForStore, RemoveInvitation } from "../../firebase/firebaseFirestore";
import '../../styles/DistributorList.css'; 

const DistributorsList = () => {
  const { currentUser } = useAuth();
  const [invitations, setInvitations] = useState([]);
  const [selectedInvitations, setSelectedInvitations] = useState({});


  useEffect(() => {
    const fetchInvitations = async () => {
      if (currentUser && currentUser.storesList && currentUser.storesList.length > 0) {
        // Fetch invitations for the first store in the user's store list
        const storeID = currentUser.storesList[0];
        try {
          const fetchedInvitations = await FetchInvitationsForStore(storeID);
          const invitationsWithDistributorNames = await Promise.all(fetchedInvitations.map(async (invitation) => {
            const distributorDetails = await FetchDistributionStoreDetails(invitation.distributorID);
            return {
              ...invitation,
              distributorName: distributorDetails.storeName, // Assuming storeName is in distributor details
            };
          }));
          setInvitations(invitationsWithDistributorNames);
        } catch (error) {
          console.error("Error fetching invitations:", error);
        }
      }
    };

    fetchInvitations();
  }, [currentUser]);

  const handleSelectInvitation = (invitationId) => {
    setSelectedInvitations(prevSelectedInvitations => ({
      ...prevSelectedInvitations,
      [invitationId]: !prevSelectedInvitations[invitationId]
    }));
  };

  const handleRemoveSelected = async () => {
    const selectedIds = Object.keys(selectedInvitations).filter(id => selectedInvitations[id]);
    if (selectedIds.length === 0) {
      alert('Please select at least one invitation to remove.');
      return;
    }
    try {
      await Promise.all(selectedIds.map(id => RemoveInvitation(id)));
      setInvitations(invitations.filter(invitation => !selectedIds.includes(invitation.id)));
      setSelectedInvitations({}); // Reset the selected invitations
      alert('Selected invitations have been successfully removed.');
    } catch (error) {
      console.error('Error removing selected invitations:', error);
      alert('Failed to remove selected invitations. Please try again.');
    }
  };


  return (
    <div>
      <MainNavBar />
      <h2>Distributors Invitations List</h2>
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
            {invitations.length > 0 ? invitations.map((invitation) => (
              <TableRow key={invitation.id} selected={selectedInvitations[invitation.id]}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={!!selectedInvitations[invitation.id]}
                    onChange={() => handleSelectInvitation(invitation.id)}
                  />
                </TableCell>
                <TableCell>{invitation.distributorName || 'Unknown Distributor'}</TableCell>
                <TableCell align="right">
                  <Chip label="Waiting" color="primary" variant="outlined" />
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={3}>No invitations found</TableCell>
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
  );
};

export default DistributorsList;
