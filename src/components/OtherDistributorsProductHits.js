import { useState, useEffect } from 'react';
import "../styles/ProductHitDetails.css";
import { CheckForExistingInvitation } from '../firebase/firebaseFirestore';

const OtherDistributorsProductHits = ({ hit }) => {
    const [invitationExists, setInvitationExists] = useState(false);

    // useEffect(() => {
    //     const checkInvitation = async () => {
    //         try {
    //             const exists = await CheckForExistingInvitation(hit.distributorID, hit.storeID);
    //             setInvitationExists(exists);
    //         } catch (error) {
    //             console.error('Error checking for existing invitation:', error);
    //         }
    //     };
        
    //     checkInvitation();
    // }, [hit.distributorID, hit.storeID]);

    return (
        <div className="product-catalog-item">
            <div className="product-name">{hit.productName}</div>
            <div className="product-brand">{hit.distributorStoreName}</div>
            <div className="product-quantity">Quantity Per Unit: {hit.quantityPerUnit}</div>
            <div className="product-price">Price: ${hit.unitPrice}</div>
            <button className="create-order-button" disabled={invitationExists}>
                {invitationExists ? 'Requested' : 'Connect'}
            </button>
        </div>
    );
};

export default OtherDistributorsProductHits;
