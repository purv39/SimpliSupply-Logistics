import React, { useEffect, useState } from 'react';
import { Grid, Typography, Button, Paper } from '@mui/material';
import { useAuth } from "../firebase/firebaseAuth";
import { FetchInvitationsForDistributor, AcceptInvitation, DeclineInvitation } from "../firebase/firebaseFirestore";

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
            await AcceptInvitation(distributorID, storeID);
            setInvitations(invitations.filter(invitation => invitation.id !== invitationId));
            // Remove the invitation from the invitations state array
            alert('Invitation accepted successfully!');
        } catch (error) {
            console.error('Error accepting invitation:', error);
            alert('Failed to accept invitation. Please try again later.');
        }
    };
    
    const handleDeclineInvitation = async (invitationId, storeID) => {
        try {
            await DeclineInvitation(distributorID, storeID);
            setInvitations(invitations.filter(invitation => invitation.id !== invitationId));
            // Remove the invitation from the invitations state array
            alert('Invitation declined successfully!');
        } catch (error) {
            console.error('Error declining invitation:', error);
            alert('Failed to decline invitation. Please try again later.');
        }
    };
    
    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Invitations
            </Typography>
            {invitations === undefined || invitations?.length === 0 ? (
                <Typography variant="body1">You have no pending invitations.</Typography>
            ) : (
                <Grid container spacing={2}>
                    {invitations.map(invitation => (
                        <Grid item xs={12} key={invitation.id}>
                            <Paper elevation={3} sx={{ p: 2 }}>
                                <Typography variant="subtitle1">Store ID: {invitation.data.storeID}</Typography>
                                <Button onClick={() => handleAcceptInvitation(invitation.id, invitation.data.storeID)}>Accept</Button>
                                <Button onClick={() => handleDeclineInvitation(invitation.id, invitation.data.storeID)}>Decline</Button>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            )}
        </div>
    );
};

export default Invitations;
