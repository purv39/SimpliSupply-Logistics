import React, { useEffect, useState } from 'react';
import { Grid, Typography, Paper, Button } from '@mui/material';
import { useAuth } from "../firebase/firebaseAuth";
import { FetchInvitationsForDistributor, AcceptInvitation, DeclineInvitation } from "../firebase/firebaseFirestore";
import { message, Pagination } from 'antd';
import MainNavBar from '../components/MainNavBar';
import '../styles/Invitations.css'; // Import CSS file

const Invitations = () => {
    const [invitations, setInvitations] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8); // Change the number of items per page as needed
    const { currentUser } = useAuth();
    const distributorID = currentUser.selectedStore;

    useEffect(() => {
        const fetchInvitations = async () => {
            try {
                const invitationsData = await FetchInvitationsForDistributor(distributorID);
                setInvitations(invitationsData);
            } catch (error) {
                console.error('Error fetching invitations:', error);
            }
        };

        fetchInvitations();
    }, [distributorID]);

    const handleAcceptInvitation = async (invitationId, storeID) => {
        try {
            await AcceptInvitation(distributorID, storeID, invitationId);
            setInvitations(invitations.filter(invitation => invitation.id !== invitationId));
            message.success('Invitation accepted successfully!');
        } catch (error) {
            console.error('Error accepting invitation:', error);
            message.error('Failed to accept invitation. Please try again later.');
        }
    };    
    
    const handleDeclineInvitation = async (invitationId, storeID) => {
        try {
            await DeclineInvitation(distributorID, storeID, invitationId);
            setInvitations(invitations.filter(invitation => invitation.id !== invitationId));
            message.success('Invitation declined successfully!');
        } catch (error) {
            console.error('Error declining invitation:', error);
            message.error('Failed to decline invitation. Please try again later.');
        }
    };    

    // Logic to get current invitations based on pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentInvitations = invitations.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const onPageChange = (page) => setCurrentPage(page);

    return (
        <div className="invitations-container">
            <MainNavBar />
            <Typography variant="h4" gutterBottom>
                Invitations
            </Typography>
            {invitations === undefined || invitations?.length === 0 ? (
                <Typography variant="body1">You have no pending invitations.</Typography>
            ) : (
                <>
                    <Grid container spacing={2}>
                        {currentInvitations.map(invitation => (
                            <Grid item xs={12} key={invitation.id}>
                                <Paper elevation={3} className="invitation-paper">
                                    <Typography variant="subtitle1" gutterBottom>Store ID: {invitation.data.storeID}</Typography>
                                    <div className="invitation-buttons">
                                        <Button
                                            variant="contained"
                                            color="success"
                                            onClick={() => handleAcceptInvitation(invitation.id, invitation.data.storeID)}
                                        >
                                            Accept
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() => handleDeclineInvitation(invitation.id, invitation.data.storeID)}
                                        >
                                            Decline
                                        </Button>
                                    </div>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                    <Pagination
                        current={currentPage}
                        pageSize={itemsPerPage}
                        total={invitations.length}
                        onChange={onPageChange}
                        showQuickJumper
                    />
                </>
            )}
        </div>
    );
};

export default Invitations;
