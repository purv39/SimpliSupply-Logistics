import { useState, useEffect } from 'react';
import "../styles/ProductHitDetails.css";
import { AddInvitation, CheckForExistingInvitation } from '../firebase/firebaseFirestore';
import { useAuth } from '../firebase/firebaseAuth';
import { message } from 'antd';

const OtherDistributorsProductHits = ({ hit }) => {
    const [invitationExists, setInvitationExists] = useState(false);
    const { currentUser } = useAuth();

    useEffect(() => {
        const checkInvitation = async () => {
            try {
                const exists = await CheckForExistingInvitation(hit.distributorID, currentUser.selectedStore);
                setInvitationExists(exists);
            } catch (error) {
                message.error(error);
                console.error('Error checking for existing invitation:', error);
            }
        };

        checkInvitation();
    }, [hit.distributorID, currentUser.selectedStore]);

    const sendInvitation = async () => {
        try {
            const invitationID = await AddInvitation(hit.distributorID, currentUser.selectedStore);
            setInvitationExists(true);
            message.success("Request sent successfully");
        } catch (error) {
            message.error(error);
        }
        
    }
    return (
        <div className="product-catalog-item">
            <div className="product-name">{hit.productName}</div>
            <div className="product-brand">{hit.distributorStoreName}</div>
            <div className="product-quantity">Quantity Per Unit: {hit.quantityPerUnit}</div>
            <div className="product-price">Price: ${hit.unitPrice}</div>
            <button className="request-button" disabled={invitationExists} onClick={sendInvitation}>
                {invitationExists ? 'Requested' : 'Connect'}
            </button>
        </div>
    );
};

export default OtherDistributorsProductHits;
