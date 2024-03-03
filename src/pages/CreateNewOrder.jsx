import { useState, useEffect } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TextField, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FetchAllDistributorsForStore, CreateNewOrderForStore } from "../firebase/firebaseFirestore";
import MainNavBar from '../components/MainNavBar';
import { RiseLoader } from 'react-spinners'; // Import RingLoader from react-spinners
import "../styles/LoadingSpinner.css";
import { useAuth } from '../firebase/firebaseAuth';
import { message } from 'antd';

const CreateNewOrder = () => {
    const [distributors, setDistributors] = useState([]);
    const [expanded, setExpanded] = useState(null);
    const [orderQuantities, setOrderQuantities] = useState({});
    const [loading, setLoading] = useState(true); // State for loading status
    const { currentUser } = useAuth();
    const storeID = currentUser.selectedStore;

    const handleDistributorClick = async (storeID) => {
        const distributorData = await FetchAllDistributorsForStore(storeID);
        setDistributors(distributorData);
        setLoading(false); // Set loading to false when data is fetched
    };

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : null);
    };

    const handleQuantityChange = (productId, distributorID, quantity) => {
        quantity = quantity.replace(/^0+/, '');

        const id = `${distributorID}-${productId}`; // Correctly concatenate distributorID and productId
        const product = distributors.find(distributor => distributor.id === distributorID)
            .data.productsData.find(product => product.id === productId);

        // Ensure quantity doesn't exceed available stock
        if (parseInt(quantity) > product.data.unitsInStock) {
            quantity = product.data.unitsInStock.toString();
        }

        // Filter out + and - symbols
        quantity = quantity.replace(/[+-]/g, '');

        // Check if quantity is a valid number
        if (!isNaN(quantity) && quantity !== '') {
            setOrderQuantities(prevState => ({
                ...prevState,
                [id]: quantity
            }));
        }
    };


    const handlePlaceOrder = async (storeID, distributorID) => {
        // Gather order items
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
        // Call handleDistributorClick when the component mounts
        handleDistributorClick(storeID);
    }, [storeID]); // Empty dependency array ensures this effect runs only once on mount

    return (
        <div>
            <MainNavBar />
            <h2>Distributors</h2>
            {loading ? ( // Render loading spinner if loading is true
                <div className="loading-spinner">
                    <RiseLoader color="#36D7B7" loading={loading} size={10} />
                </div>
            ) : (distributors === undefined || distributors.length === 0) ? (
                <Typography>No distributors available</Typography>
            ) : (
                distributors.map(distributor => (
                    <Accordion
                        key={distributor.id}
                        expanded={expanded === distributor.id}
                        onChange={handleChange(distributor.id)}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1bh-content"
                            id="panel1bh-header"
                        >
                            <Typography>{distributor.data.storeName}</Typography>
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
                                        {distributor.data.productsData.map(product => (
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
                                                        style={{ width: '70%' }}
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
                                onClick={() => handlePlaceOrder(storeID, distributor.id)} // Hardcoded storeID, replace with actual storeID
                                style={{ marginTop: '10px' }}
                            >
                                Checkout
                            </Button>
                        </AccordionDetails>
                    </Accordion>
                )))}
        </div>
    );
}

export default CreateNewOrder;
