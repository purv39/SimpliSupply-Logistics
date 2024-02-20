import React, { Fragment } from 'react';
import { useState, useEffect } from 'react';
import { Collapse, Table, TableHead, TableBody, TableRow, TableCell, Typography, Paper, IconButton, TableContainer, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { fetchOrderHistoryForStore } from '../firebase/firebaseFirestore';

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
                            <Fragment key={order.id}>
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
                                <TableRow>
                                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                        <Collapse in={expandedOrderId === order.id} timeout="auto" unmountOnExit>
                                            <Box sx={{ margin: 1 }}>
                                                <Typography variant="h6" gutterBottom component="div">
                                                    Order Details
                                                </Typography>
                                                <Table size="small" aria-label="order details">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>Category Name</TableCell>
                                                            <TableCell>Product Name</TableCell>
                                                            <TableCell>Quantity Per Unit</TableCell>
                                                            <TableCell>Unit Price</TableCell>
                                                            <TableCell>Units Ordered</TableCell>
                                                            <TableCell>Product Cost</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {order.orderItems.map((item, index) => (
                                                            <TableRow key={index}>
                                                                <TableCell>{item.productData?.data?.categoryName}</TableCell>
                                                                <TableCell>{item.productData?.data?.productName}</TableCell>
                                                                <TableCell>{item.productData?.data?.quantityPerUnit}</TableCell>
                                                                <TableCell>${item.productData?.data?.unitPrice.toFixed(2)}</TableCell>
                                                                <TableCell>{item.unitsOrdered}</TableCell>
                                                                <TableCell>${item.productCost.toFixed(2)}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </Box>
                                        </Collapse>
                                    </TableCell>
                                </TableRow>
                            </Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>

    );
};

export default OrderHistory;
