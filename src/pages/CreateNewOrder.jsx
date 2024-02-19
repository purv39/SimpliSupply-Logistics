import { useState, useEffect } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TextField } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FetchAllDistributorsForStore } from "../firebase/firebaseFirestore";

const CreateNewOrder = () => {
    const [distributors, setDistributors] = useState([]);
    const [expanded, setExpanded] = useState(null);
    const [orderQuantities, setOrderQuantities] = useState({});

    const handleDistributorClick = async (storeID) => {
        const distributorData = await FetchAllDistributorsForStore(storeID);
        setDistributors(distributorData);
    };

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : null);
    };

    const handleQuantityChange = (productId, quantity) => {
        setOrderQuantities(prevState => ({
            ...prevState,
            [productId]: quantity
        }));
    };

    useEffect(() => {
        // Call handleDistributorClick when the component mounts
        const storeID = "5NxCpVGHf520hNnWJYuX"; // Replace with your store ID
        handleDistributorClick(storeID);
    }, []); // Empty dependency array ensures this effect runs only once on mount

    return (
        <div>
            <h2>Distributors</h2>
            {distributors.map(distributor => (
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
                                                    value={orderQuantities[product.id] || ''}
                                                    onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                                                    inputProps={{ min: '0', max: product.data.unitsInStock }}
                                                    style={{ width: '70%' }} 
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </AccordionDetails>
                </Accordion>
            ))}
        </div>
    );
}

export default CreateNewOrder;
