import { useState } from 'react';
import { TextField, Button, Typography, Grid } from '@mui/material';
import { AddProductToInventory } from '../firebase/firebaseFirestore';
import { useAuth } from '../firebase/firebaseAuth';
import { message, Modal } from 'antd';
import MainNavBar from '../components/MainNavBar';

const AddProducts = () => {
  const { currentUser } = useAuth();
  const selectedStore = currentUser.selectedStore;

  const [product, setProduct] = useState({
    productName: '',
    category: '',
    quantityPerUnit: '',
    unitPrice: '',
    unitsInStock: ''
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (!product.productName || !product.category || !product.quantityPerUnit || !product.unitPrice || !product.unitsInStock) {
      setError('Please fill out all fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Add product to inventory
      await AddProductToInventory(
        selectedStore,
        product.productName,
        product.category,
        product.quantityPerUnit,
        parseFloat(product.unitPrice),
        parseInt(product.unitsInStock)
      );

      // Reset form fields
      setProduct({
        productName: '',
        category: '',
        quantityPerUnit: '',
        unitPrice: '',
        unitsInStock: ''
      });

      // Provide feedback to the user
      message.success('Product added successfully!');
    } catch (error) {
      setError('Failed to add product. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setError('');
  };

  return (
    <div>
      <MainNavBar />
      <Typography variant="h4" gutterBottom>
        Add Products
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Product Name"
              name="productName"
              value={product.productName}
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Category"
              name="category"
              value={product.category}
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Quantity Per Unit"
              name="quantityPerUnit"
              value={product.quantityPerUnit}
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Unit Price"
              name="unitPrice"
              type="number"
              value={product.unitPrice}
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Units In Stock"
              name="unitsInStock"
              type="number"
              value={product.unitsInStock}
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>
        </Grid>
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? 'Adding...' : 'Add Product'}
        </Button>
      </form>
      <Modal
        title="Error"
        visible={!!error}
        onCancel={handleModalClose}
        footer={[
          <Button key="ok" onClick={handleModalClose} type="primary">
            OK
          </Button>
        ]}
      >
        <p>{error}</p>
      </Modal>
    </div>
  );
};

export default AddProducts;
