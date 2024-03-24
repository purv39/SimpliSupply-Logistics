import React, { useState, useEffect } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, CircularProgress, Grid, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FetchAllDistributorsForStore, CreateNewOrderForStore } from "../firebase/firebaseFirestore";
import MainNavBar from '../components/MainNavBar';
import { useAuth } from '../firebase/firebaseAuth';
import { message } from 'antd';
import { useParams } from 'react-router-dom';
import { Pagination } from 'antd';

const CreateNewOrder = () => {
    const [distributors, setDistributors] = useState([]);
    const [expanded, setExpanded] = useState(null);
    const [orderQuantities, setOrderQuantities] = useState({});
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1); // State for current page
    const [productPage, setProductPage] = useState({}); // State for product page
    const [itemsPerPage, setItemsPerPage] = useState(5); // Number of items per page
    const { currentUser } = useAuth();
    const storeID = currentUser.selectedStore;
    const { distributorID: paramsDistributorID } = useParams();

    const handleDistributorClick = async (storeID) => {
        setLoading(true);
        const distributorData = await FetchAllDistributorsForStore(storeID);
        setDistributors(distributorData);
        setLoading(false);
    };

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : null);
        handleProductPageChange(panel, 1);
    };

    const handleQuantityChange = (productId, distributorID, quantity) => {
        const id = `${distributorID}-${productId}`;
        const product = distributors.find(distributor => distributor.id === distributorID)
            .data.productsData.find(product => product.id === productId);

        if (parseInt(quantity) > product.data.unitsInStock) {
            quantity = product.data.unitsInStock.toString();
        }

        quantity = quantity.replace(/[+-]/g, '');

        if (!isNaN(quantity) && quantity !== '') {
            setOrderQuantities(prevState => ({
                ...prevState,
                [id]: quantity
            }));
        }
    };

    const handlePlaceOrder = async (storeID, distributorID) => {
        try {
            const orderItems = [];
            distributors.forEach(distributor => {
                if (distributor.id === distributorID) {
                    distributor.data.productsData.forEach(product => {
                        const quantity = orderQuantities[`${distributor.id}-${product.id}`] || 0;
                        if (quantity > 0) {
                            orderItems.push({
                                productData: product,
                                unitsOrdered: quantity
                            });
                        }
                    });
                }
            });

            if (orderItems?.length !== 0) {
                await CreateNewOrderForStore(storeID, distributorID, orderItems);
                message.success('Order Placed Successfully');
                setExpanded(false);
                setOrderQuantities({});
            } else {
                throw new Error('Error Creating Order: Please make sure the quantity is set properly!!');
            }
        } catch (error) {
            message.error(error.message);
        }
    };

    useEffect(() => {
        handleDistributorClick(storeID);

        if (paramsDistributorID) {
            setExpanded(paramsDistributorID);
        }
    }, [storeID, paramsDistributorID]); // Empty dependency array ensures this effect runs only once on mount

    // Logic to get current distributors based on pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentDistributors = distributors.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const onPageChange = (page) => setCurrentPage(page);

    // Product page change handler
    const handleProductPageChange = (distributorID, page) => {
        setProductPage(prevState => ({
            ...prevState,
            [distributorID]: page
        }));
    };

    return (
        <Box>
            <MainNavBar />
            <h2>Distributors</h2>
            {loading ? (
                <Grid container justifyContent="center">
                    <CircularProgress color="primary" />
                </Grid>
            ) : (
                <Grid container spacing={2}>
                    {currentDistributors.map(distributor => (
                        <Grid item xs={12} key={distributor.id}>
                            <Accordion
                                expanded={expanded === distributor.id}
                                onChange={handleChange(distributor.id)}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1bh-content"
                                    id="panel1bh-header"
                                >
                                    <h4>{distributor.data.storeName}</h4>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <TableContainer component={Paper}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Category Name</TableCell>
                                                    <TableCell>Product Name</TableCell>
                                                    <TableCell>Quantity Per Unit</TableCell>
                                                    <TableCell>Unit Price</TableCell>
                                                    <TableCell>Units In Stock</TableCell>
                                                    <TableCell>Quantity to Order</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {distributor.data.productsData
                                                    .slice((productPage[distributor.id] - 1) * itemsPerPage, productPage[distributor.id] * itemsPerPage)
                                                    .map(product => (
                                                        <TableRow key={product.id}>
                                                            <TableCell>{product.data.categoryName}</TableCell>
                                                            <TableCell>{product.data.productName}</TableCell>
                                                            <TableCell>{product.data.quantityPerUnit}</TableCell>
                                                            <TableCell>${product.data.unitPrice}</TableCell>
                                                            <TableCell>{product.data.unitsInStock}</TableCell>
                                                            <TableCell>
                                                                <TextField
                                                                    type="number"
                                                                    value={orderQuantities[`${distributor.id}-${product.id}`] || ''}
                                                                    onChange={(e) => handleQuantityChange(product.id, distributor.id, e.target.value)}
                                                                    inputProps={{ min: '0', max: product.data.unitsInStock }}
                                                                    fullWidth
                                                                    variant="outlined"
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handlePlaceOrder(storeID, distributor.id)}
                                        style={{ marginTop: '10px' }}
                                    >
                                        Place Order
                                    </Button>
                                    {/* Pagination for products */}
                                    <Box mt={2} display="flex" justifyContent="center">
                                        <Pagination
                                            current={productPage[distributor.id]}
                                            pageSize={itemsPerPage}
                                            total={distributor.data.productsData.length}
                                            onChange={(page) => handleProductPageChange(distributor.id, page)}
                                            showQuickJumper
                                        />
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        </Grid>
                    ))}
                </Grid>
            )}
            {/* Pagination for distributors */}
            <Box mt={4} display="flex" justifyContent="center">
                <Pagination
                    current={currentPage}
                    pageSize={itemsPerPage}
                    total={distributors.length}
                    onChange={onPageChange}
                    showQuickJumper
                />
            </Box>
        </Box>
    );
}

export default CreateNewOrder;

