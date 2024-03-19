import { Modal, Button, Form, Input, Typography } from 'antd';
import { useState, useEffect } from 'react';
import "../styles/ProductDetailsModal.css";
import { CreateNewOrderForStore } from '../firebase/firebaseFirestore';
import { useAuth } from '../firebase/firebaseAuth';
import { message } from 'antd';

const ProductDetailsModal = ({ visible, handleCancel, hit, connected }) => {
    const [quantity, setQuantity] = useState(hit.moq);
    const [error, setError] = useState('');
    const [validQuantity, setValidQuantity] = useState(true);
    const { currentUser } = useAuth();
    const [totalPrice, setTotalPrice] = useState(0);

    const handleQuantityChange = (value) => {
        setQuantity(prevQuantity => {
            const newQuantity = parseInt(value);
            return isNaN(newQuantity) ? prevQuantity : newQuantity;
        });
        setError(''); // Reset error message when quantity changes
    };

    useEffect(() => {
        const validateQuantity = () => {
            if (quantity < hit.moq) {
                setError(`Quantity should be at least ${hit.moq}`);
                setValidQuantity(false);
            } else if (hit.unitsInStock === 0) {
                setError(`Item out of stock`);
                setValidQuantity(false);
            }
             else if (quantity > hit.unitsInStock) {
                setError(`Quantity should be less than ${hit.unitsInStock}`);
                setValidQuantity(false);
            } else {
                setError('');
                setValidQuantity(true);
            }
        };

        if(connected) {
            setTotalPrice((hit.unitPrice * quantity).toFixed(2));
        } else {
            setTotalPrice((hit.unitPrice * hit.moq).toFixed(2));
        }
        validateQuantity();
    }, [quantity, hit.moq, hit.unitsInStock, totalPrice, connected, hit.unitPrice]);

    const handlePlaceOrder = async () => {
        try {
            const id = hit.objectID.split('-');
            console.log(id)
            const item = [{
                productData: {
                    data: {
                        categoryName: "test",
                        productName: hit.productName,
                        unitPrice: hit.unitPrice,
                        quantityPerUnit: hit.quantityPerUnit,
                        moq: hit.moq
                    },
                    id: id[1]
                },
                unitsOrdered: quantity
            }];

            // Create the new order
            await CreateNewOrderForStore(currentUser.selectedStore, hit.distributorID, item);

            message.success("Order Placed Successfully!")
            handleCancel(); // Close the modal after successful order placement
        } catch (error) {
            message.error("Error placing order: " + error)
            console.error("Error placing order:", error);
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
                </Button>)
            ]}
            style={{ top: 20 }}
            width={800}
        >
            <Form layout="vertical">
                <Typography.Title level={4}>Product Information</Typography.Title>
                <Typography.Paragraph>
                    <strong>Product Name:</strong> {hit.productName}
                </Typography.Paragraph>
                <Typography.Paragraph>
                    <strong>Description:</strong> {hit.productDescription}
                </Typography.Paragraph>
                <Typography.Paragraph>
                    <strong>Distributor:</strong> {hit.distributorStoreName}
                </Typography.Paragraph>
                <Typography.Paragraph>
                    <strong>Quantity Per Unit:</strong> {hit.quantityPerUnit}
                </Typography.Paragraph>

                <Typography.Title level={4}>Order Details</Typography.Title>
                {connected &&
                    <Form.Item label="Quantity" validateStatus={error ? 'error' : ''} help={error}>
                        <Input type="number" value={quantity} onChange={(e) => handleQuantityChange(e.target.value)} />
                    </Form.Item>}
                <Typography.Paragraph>
                    <strong>MOQ (Minimum Order Quantity):</strong> {hit.moq}
                </Typography.Paragraph>
                <Typography.Paragraph>
                    <strong>Units In Stock:</strong> {hit.unitsInStock}
                </Typography.Paragraph>
                <Typography.Paragraph>
                    <strong>Unit Price:</strong> ${hit.unitPrice.toFixed(2)}
                </Typography.Paragraph>
                <Typography.Paragraph>
                    <strong>Total Price:</strong> ${totalPrice}
                </Typography.Paragraph>
            </Form>
        </Modal>
    );
};

export default ProductDetailsModal;
