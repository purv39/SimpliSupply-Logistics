import React, { useState, useEffect } from 'react';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { fetchOrderHistoryForStore } from '../firebase/firebaseFirestore';
import OrderDetailsTable from '../components/OrderDetailsTable';
import MainNavBar from '../components/MainNavBar';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            const orderData = await fetchOrderHistoryForStore("5NxCpVGHf520hNnWJYuX");
            setOrders(orderData);
        }

        fetchOrders();
    }, []);

    // Function to format timestamp into a human-readable date string
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
            <h2>Order History</h2>
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Order ID</TableCell>
                            <TableCell>Distributor Name</TableCell>
                            <TableCell>Total Cost</TableCell>
                            <TableCell>Created At</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order) => (
                            <React.Fragment key={order.id}>
                                <TableRow onClick={() => handleExpandClick(order.id)}>

                                    <TableCell>{`${order.id}`}</TableCell>
                                    <TableCell>{`${order.distributorName}`}</TableCell>
                                    <TableCell>{`$${order.totalCost}`}</TableCell>
                                    <TableCell>{`${formatDate(order.createdAt)}`}</TableCell>
                                    <TableCell>{`${order.currentStatus}`}</TableCell>
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
                                <OrderDetailsTable order={order} expandedOrderId={expandedOrderId} />
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>

    );
};

export default OrderHistory;
