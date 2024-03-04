import React from 'react';
import { Box, Collapse, Table, TableHead, TableBody, TableRow, TableCell, Typography } from '@mui/material';

const ShipmentDetailsTable = ({ order, expandedOrderId }) => {
    return (
        <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                <Collapse in={expandedOrderId === order.id} timeout="auto" unmountOnExit>
                    <Box sx={{ margin: 1 }}>
                        <Typography variant="h6" gutterBottom component="div">
                            Shipment Details
                        </Typography>
                        <Table size="small" aria-label="shipment details">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Product Name</TableCell>
                                    <TableCell>Quantity Per Unit</TableCell>
                                    <TableCell>Unit Price</TableCell>
                                    <TableCell>Units Ordered</TableCell>
                                    <TableCell>Total Price</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {order.orderItems.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{item.productData?.data?.productName}</TableCell>
                                        <TableCell>{item.productData?.data?.quantityPerUnit}</TableCell>
                                        <TableCell>${item.productData?.data?.unitPrice.toFixed(2)}</TableCell>
                                        <TableCell>{item.unitsOrdered}</TableCell>
                                        <TableCell>${(item.productData?.data?.unitPrice * item.unitsOrdered).toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Box>
                </Collapse>
            </TableCell>
        </TableRow>
    );
};

export default ShipmentDetailsTable;
