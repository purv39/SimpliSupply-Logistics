import { useState, useEffect } from 'react';
import "../styles/ProductHitDetails.css";
import { AddInvitation, CheckForExistingInvitation } from '../firebase/firebaseFirestore';
import { useAuth } from '../firebase/firebaseAuth';
import { message } from 'antd';
import { InfoOutlined } from '@mui/icons-material';
import ProductDetailsModal from '../pages/ProductDetailsModal';

const OtherDistributorsProductHits = ({ hit }) => {
    const [invitationExists, setInvitationExists] = useState(false);
    const { currentUser } = useAuth();
    const [visible, setVisible] = useState(false);
    const showModal = () => {
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
    };

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
            const existingInvitation = await CheckForExistingInvitation(hit.distributorID, currentUser.selectedStore);
            if (existingInvitation) {
                message.error("It has already been requested.");
                return;
            }
            const invitationID = await AddInvitation(hit.distributorID, currentUser.selectedStore);
            setInvitationExists(true);
            message.success("Request sent successfully");
        } catch (error) {
            message.error(error);
        }

    }
    return (
        <div className="product-catalog-item">
            <div className="product-name">{hit.productName} <InfoOutlined onClick={showModal} style={{ cursor: "pointer" }} /></div>
            <div className="product-brand">{hit.distributorStoreName}</div>
            <div className="product-quantity">Quantity Per Unit: {hit.quantityPerUnit}</div>
            <div className="product-quantity">MOQ: {hit.moq}</div>
            <div className="product-price">Price: ${hit.unitPrice}</div>
            <button className="request-button" disabled={invitationExists} onClick={sendInvitation}>
                {invitationExists ? 'Requested' : 'Connect'}
            </button>
            <ProductDetailsModal visible={visible} handleCancel={handleCancel} hit={hit} connected={false} />

        </div>
    );
};

export default OtherDistributorsProductHits;
