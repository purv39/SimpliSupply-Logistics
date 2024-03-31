import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Form, Input, Typography, message } from 'antd';
import axios from 'axios';
import { useAuth } from '../firebase/firebaseAuth';
import { CreateNewOrderForStore } from '../firebase/firebaseFirestore';

const ProductDetailsModal = ({ visible, handleCancel, hit, connected }) => {
    const [quantity, setQuantity] = useState(hit.moq);
    const [error, setError] = useState('');
    const [validQuantity, setValidQuantity] = useState(true);
    const [totalPrice, setTotalPrice] = useState(0);
    const [imageUrl, setImageUrl] = useState('');
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchImage = async () => {
            try {
                if (hit?.productImageURL) {
                    const response = await axios.get(hit.productImageURL, {
                        headers: {
                            Authorization: `Bearer ${currentUser?.user?.stsTokenManager?.accessToken}`,
                        },
                        responseType: 'blob',
                    });
                    if (response.data) {
                        const blobUrl = URL.createObjectURL(response.data);
                        setImageUrl(blobUrl);
                    }
                } else {
                    setImageUrl(hit?.url);
                }
            } catch (error) {
                console.error('Error fetching image:', error);
            }
        };

        if (visible) {
            fetchImage();
        }
    }, [visible, hit, currentUser]);

    useEffect(() => {
        const validateQuantity = () => {
            if (quantity < hit.moq) {
                setError(`Quantity should be at least ${hit.moq}`);
                setValidQuantity(false);
            } else if (hit.unitsInStock === 0) {
                setError('Item out of stock');
                setValidQuantity(false);
            } else if (quantity > hit.unitsInStock) {
                setError(`Quantity should be less than ${hit.unitsInStock}`);
                setValidQuantity(false);
            } else {
                setError('');
                setValidQuantity(true);
            }
        };

        if (connected) {
            setTotalPrice((hit.unitPrice * quantity).toFixed(2));
        } else {
            setTotalPrice((hit.unitPrice * hit.moq).toFixed(2));
        }
        validateQuantity();
    }, [quantity, hit, connected]);

    const handleQuantityChange = (value) => {
        setQuantity((prevQuantity) => {
            const newQuantity = parseInt(value);
            return isNaN(newQuantity) ? prevQuantity : newQuantity;
        });
        setError(''); // Reset error message when quantity changes
    };

    const handlePlaceOrder = async () => {
        try {
            const id = hit.objectID.split('-');
            const item = [{
                productData: {
                    data: {
                        categoryName: hit?.categoryName,
                        productName: hit?.productName,
                        unitPrice: hit?.unitPrice,
                        quantityPerUnit: hit?.quantityPerUnit,
                        moq: hit.moq,
                    },
                    id: id[1],
                },
                unitsOrdered: quantity,
            }];

            await CreateNewOrderForStore(currentUser.selectedStore, hit.distributorID, item);

            message.success('Order Placed Successfully!');
            handleCancel(); // Close the modal after successful order placement
        } catch (error) {
            message.error('Error placing order: ' + error);
            console.error('Error placing order:', error);
        }
    };

    return (
        <Modal
            title="Product Details"
            visible={visible}
            onCancel={handleCancel}
            footer={[
                <Button key="back" onClick={handleCancel}>
                    Close
                </Button>,
                connected && (
                    <Button key="submit" type="primary" onClick={handlePlaceOrder} disabled={!validQuantity}>
                        Place Order
                    </Button>
                ),
            ]}
            style={{ top: 20 }}
            width={800}
        >
            <div style={{ display: 'flex' }}>
                <div>
                    <img
                        style={{ width: '300px', height: '300px' }}
                        src={imageUrl || 'https://via.placeholder.com/150'}
                        alt="Product"
                    />
                </div>
                <div style={{ marginLeft: '20px' }}>
                    <Typography.Title level={4}>Product Information</Typography.Title>
                    <Typography.Paragraph>
                        <strong>Product Name:</strong> 
                        <div>{hit?.productName}</div>
                    </Typography.Paragraph>
                    <Typography.Paragraph>
                        <strong>Brand:</strong> 
                        <div>{hit?.brandName}</div>
                    </Typography.Paragraph>
                    <Typography.Paragraph>
                        <strong>Description:</strong> 
                        <div>{hit?.productDescription}</div>
                    </Typography.Paragraph>
                    <Typography.Paragraph>
                        <strong>Distributor:</strong> 
                        <div>{hit?.distributorStoreName}</div> 
                    </Typography.Paragraph>
                    <Typography.Paragraph>
                        <strong>Quantity Per Unit:</strong>
                        <div>{hit?.quantityPerUnit}</div> 
                    </Typography.Paragraph>
                </div>
            </div>
            <Typography.Title level={4} style={{ marginTop: '20px' }}>Order Details</Typography.Title>
            {connected && (
                <Form layout="vertical">
                    <Form.Item label="Quantity" validateStatus={error ? 'error' : ''} help={error}>
                        <Input type="number" value={quantity} onChange={(e) => handleQuantityChange(e.target.value)} />
                    </Form.Item>
                </Form>
            )}
            <Typography.Paragraph>
                <strong>MOQ (Minimum Order Quantity):</strong> {hit?.moq}
            </Typography.Paragraph>
            <Typography.Paragraph>
                <strong>Units In Stock:</strong> {hit?.unitsInStock}
            </Typography.Paragraph>
            <Typography.Paragraph>
                <strong>Unit Price:</strong> ${hit?.unitPrice?.toFixed(2)}
            </Typography.Paragraph>
            <Typography.Paragraph>
                <strong>Total Price:</strong> ${totalPrice}
            </Typography.Paragraph>
        </Modal>
    );
};

ProductDetailsModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    handleCancel: PropTypes.func.isRequired,
    hit: PropTypes.object.isRequired,
    connected: PropTypes.bool.isRequired,
};

export default ProductDetailsModal;
