import React, { useState, useEffect } from 'react';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { fetchOrderHistoryForStore } from '../firebase/firebaseFirestore';
import OrderDetailsTable from '../components/OrderDetailsTable';
import MainNavBar from '../components/MainNavBar';
import { RiseLoader } from 'react-spinners';
import "../styles/LoadingSpinner.css";
import { useAuth } from '../firebase/firebaseAuth';
import { Typography } from 'antd';
import { Pagination } from 'antd'; // Import Pagination from Ant Design

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [loading, setLoading] = useState(true); // State for loading status
    const [currentPage, setCurrentPage] = useState(1); // State for current page
    const [itemsPerPage, setItemsPerPage] = useState(8); // Number of items per page
    const { currentUser } = useAuth();
    const storeID = currentUser.selectedStore;

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            const orderData = await fetchOrderHistoryForStore(storeID);
            setOrders(orderData);
            setLoading(false); // Set loading to false when data is fetched
        }

        fetchOrders();
    }, [storeID]);

    // Function to format timestamp into a human-readable date string
    const formatDate = (timestamp) => {
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleString();
    };

    const handleExpandClick = (orderId) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

    // Logic to get current orders based on pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const onPageChange = (page) => setCurrentPage(page);

    return (
        <div>
            <MainNavBar />
            <h2>Order History</h2>
            {loading ? (
                <div className="loading-spinner">
                    <RiseLoader color="#36D7B7" loading={loading} size={10} />
                </div>
            ) : orders.length === 0 ? (
                <Typography>No orders in order history</Typography>
            ) : (
                <div>
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
                                {currentOrders.map((order) => (
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
                    <div className="pagination-container">
                        <Pagination
                            current={currentPage}
                            pageSize={itemsPerPage}
                            total={orders.length}
                            onChange={onPageChange}
                            showQuickJumper
                        />
                    </div>
                </div>
            )}
        </div >
    );
};

export default OrderHistory;
