import React, { useEffect, useState } from 'react';
import { Grid, Typography, Paper, Button } from '@mui/material';
import { useAuth } from "../firebase/firebaseAuth";
import { FetchInvitationsForDistributor, AcceptInvitation, DeclineInvitation } from "../firebase/firebaseFirestore";
import { message } from 'antd';
import MainNavBar from '../components/MainNavBar';
// import { CheckCircleOutlineOutlined, CancelOutlined } from '@mui/icons-material'; 
import '../styles/Invitations.css'; // Import CSS file

const Invitations = () => {
    const [invitations, setInvitations] = useState([]);
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
    
    return (
        <div className="invitations-container">
            <MainNavBar />
            <Typography variant="h4" gutterBottom>
                Invitations
            </Typography>
            {invitations === undefined || invitations?.length === 0 ? (
                <Typography variant="body1">You have no pending invitations.</Typography>
            ) : (
                <Grid container spacing={2}>
                    {invitations.map(invitation => (
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
            )}
        </div>
    );
};

export default Invitations;
