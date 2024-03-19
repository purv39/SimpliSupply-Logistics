import { useState } from 'react';
import { TextField, Button, Typography, Grid } from '@mui/material';
import { AddProductToInventory } from '../firebase/firebaseFirestore';
import { useAuth } from '../firebase/firebaseAuth';
import { message, Modal } from 'antd';
import MainNavBar from '../components/MainNavBar';
import '../styles/AddProducts.css';

const AddProducts = () => {
  const { currentUser } = useAuth();
  const selectedStore = currentUser.selectedStore;

  const [product, setProduct] = useState({
    productName: '',
    category: '',
    description: '',
    quantityPerUnit: '',
    unitPrice: '',
    unitsInStock: '',
    moq: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e) => {
    // Form submission logic
  };

  const handleModalClose = () => {
    setError('');
  };

  return (
    <div>
      <MainNavBar />
      <div className="add-products-container">
        <Typography variant="h4" gutterBottom>
          Add Products
        </Typography>
        <form className="add-products-form" onSubmit={handleSubmit}>
          <div className="add-products-form-row">
            <TextField
              label="Product Name"
              name="productName"
              value={product.productName}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Category"
              name="category"
              value={product.category}
              onChange={handleChange}
              required
              fullWidth
            />
          </div>
          <div className="add-products-form-row">
            <TextField
              label="Description"
              name="description"
              value={product.description}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Quantity Per Unit"
              name="quantityPerUnit"
              value={product.quantityPerUnit}
              onChange={handleChange}
              required
              fullWidth
            />
          </div>
          <div className="add-products-form-row">
            <TextField
              label="Unit Price"
              name="unitPrice"
              type="number"
              value={product.unitPrice}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Units In Stock"
              name="unitsInStock"
              type="number"
              value={product.unitsInStock}
              onChange={handleChange}
              required
              fullWidth
            />
          </div>
          <div className="add-products-form-row">
            <TextField
              label="Minimum Order Quantity (MOQ)"
              name="moq"
              type="number"
              value={product.moq}
              onChange={handleChange}
              required
              fullWidth
            />
          </div>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            className="add-products-submit-button"
          >
            {loading ? 'Adding...' : 'Add Product'}
          </Button>
        </form>
      </div>
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