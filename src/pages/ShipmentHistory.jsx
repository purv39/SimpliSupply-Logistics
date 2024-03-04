import React, { useState, useEffect } from 'react';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { fetchOrderHistoryForDistributor } from '../firebase/firebaseFirestore';
import ShipmentDetailsTable from '../components/ShipmentDetailsTable';
import MainNavBar from '../components/MainNavBar';
import { RiseLoader } from 'react-spinners';
import "../styles/LoadingSpinner.css";
import { useAuth } from '../firebase/firebaseAuth';
import { Typography } from 'antd';

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

    return (
        <div>
            <MainNavBar />
            <h2>Shipment History</h2>
            {loading ? (
                <div className="loading-spinner">
                    <RiseLoader color="#36D7B7" loading={loading} size={10} />
                </div>
            ) : shipments.length === 0 ? (
                <Typography>No shipments in shipment history</Typography>
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
                                <TableCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {shipments.map((order) => (
                                <React.Fragment key={order.id}>
                                    <TableRow onClick={() => handleExpandClick(order.id)}>
                                        <TableCell>{order.id}</TableCell>
                                        <TableCell>{order.storeName}</TableCell>
                                        <TableCell>{`$${order.totalCost}`}</TableCell>
                                        <TableCell>{formatDate(order.createdAt)}</TableCell>
                                        <TableCell>{order.currentStatus}</TableCell>
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
