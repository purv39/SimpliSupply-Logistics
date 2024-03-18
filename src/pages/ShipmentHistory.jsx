import React, { useState, useEffect } from 'react';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, IconButton, Button, Typography, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { fetchOrderHistoryForDistributor, updateOrderStatus } from '../firebase/firebaseFirestore'; // Import the function to update order status
import ShipmentDetailsTable from '../components/ShipmentDetailsTable';
import MainNavBar from '../components/MainNavBar';
import { RiseLoader } from 'react-spinners';
import { useAuth } from '../firebase/firebaseAuth';

const ShipmentHistory = () => {
    const [shipments, setShipments] = useState([]);
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();
    const distributorID = currentUser.selectedStore;

    useEffect(() => {
        const fetchShipments = async () => {
            const shipmentData = await fetchOrderHistoryForDistributor(distributorID);
            setShipments(shipmentData);
            setLoading(false);
        };

        fetchShipments();
    }, [distributorID]);

    const formatDate = (timestamp) => {
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleString();
    };

    const handleExpandClick = (orderId) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            // Update the status in the UI
            const updatedShipments = shipments.map(order => {
                if (order.id === orderId) {
                    return { ...order, currentStatus: newStatus };
                }
                return order;
            });
            setShipments(updatedShipments);
        } catch (error) {
            console.error('Error updating order status:', error);
            // Handle error (e.g., display error message to user)
        }
    };

    return (
        <div>
            <MainNavBar />
            <Typography variant="h4" gutterBottom>
                Shipment History
            </Typography>
            {loading ? (
                <div className="loading-spinner">
                    <RiseLoader color="#36D7B7" loading={loading} size={10} />
                </div>
            ) : shipments.length === 0 ? (
                <Typography variant="body1">No shipments in shipment history</Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table aria-label="collapsible table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Order ID</TableCell>
                                <TableCell>Store Name</TableCell>
                                <TableCell>Total Cost</TableCell>
                                <TableCell>Created At</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Actions</TableCell> {/* Add a new column for actions */}
                                <TableCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {shipments.map((order) => (
                                <React.Fragment key={order.id}>
                                    <TableRow>
                                        <TableCell>{order.id}</TableCell>
                                        <TableCell>{order.storeName}</TableCell>
                                        <TableCell>{`$${order.totalCost}`}</TableCell>
                                        <TableCell>{formatDate(order.createdAt)}</TableCell>
                                        <TableCell>{order.currentStatus}</TableCell>
                                        <TableCell>
                                            <Button variant="outlined" onClick={() => handleStatusChange(order.id, 'Shipped')}>
                                                Mark as Shipped
                                            </Button>
                                            {/* Add more buttons or dropdown menu options for other status changes */}
                                        </TableCell>
                                        <TableCell>
                                            <IconButton
                                                aria-label="expand row"
                                                size="small"
                                                onClick={() => handleExpandClick(order.id)}
                                            >
                                                {expandedOrderId === order.id ? <KeyboardArrowUpIcon /> : <ExpandMoreIcon />}
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                    <ShipmentDetailsTable order={order} expandedOrderId={expandedOrderId} />
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </div>
    );
};

export default ShipmentHistory;
