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
  const [csvFile, setCsvFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setCsvFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (!product.productName || !product.category || !product.quantityPerUnit || !product.unitPrice || !product.unitsInStock || !product.description || !product.moq) {
      setError('Please fill out all fields.');
      return;
    }

    if (parseFloat(product.unitPrice) <= 0 || parseInt(product.unitsInStock) <= 0 || parseInt(product.moq) <= 0) {
      setError('Unit price, units in stock, and MOQ must be positive numbers.');
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
        product.description,
        product.quantityPerUnit,
        parseFloat(product.unitPrice),
        parseInt(product.unitsInStock),
        parseInt(product.moq)
      );

      // Reset form fields
      setProduct({
        productName: '',
        category: '',
        description: '',
        quantityPerUnit: '',
        unitPrice: '',
        unitsInStock: '',
        moq: ''
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

  const handleCsvSubmit = (e) => {
    e.preventDefault();
    if (!csvFile) {
      setError('Please select a CSV file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const csvData = event.target.result;
      // Parse CSV data and validate
      // Then add products to inventory
    };
    reader.readAsText(csvFile);
  };

  return (
    <div>
      <MainNavBar />
      <div className="add-products-container">
        <Typography variant="h4" gutterBottom>
          Add Products
        </Typography>
        <form className="csv-form" onSubmit={handleCsvSubmit}>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="csv-input"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            className="csv-submit-button"
          >
            Import from CSV
          </Button>
        </form>
        
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
