import { useState, useEffect } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Table, TableHead, TableBody, TableRow, TableCell, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { fetchOrderHistoryForStore } from '../firebase/firebaseFirestore';

const OrderHistory = ({ userID }) => {
    const [orders, setOrders] = useState([]);

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

    return (
        <div>
            <h2>Order History</h2>
            {orders.map((order) => (
                <Accordion key={order.id}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`order-details-${order.id}`}
                        id={`order-summary-${order.id}`}
                    >
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell>{`Order ID: ${order.id}`}</TableCell>
                                    <TableCell>{`Distributor: ${order.distributorName}`}</TableCell>
                                    <TableCell>{`Total Cost: $${order.totalCost}`}</TableCell>
                                    <TableCell>{`Created At: ${formatDate(order.createdAt)}`}</TableCell>
                                    <TableCell>{`Status: ${order.currentStatus}`}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Table>
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
                    </AccordionDetails>
                </Accordion>
            ))}
        </div>
    );
};

export default OrderHistory;
