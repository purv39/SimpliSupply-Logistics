import { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
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
    moq: '',
    url: '',
    brandName: '',
    product_image: ''

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
    if (!product.productName || !product.category || !product.quantityPerUnit || !product.unitPrice || !product.unitsInStock || !product.description || !product.moq || !product.brandName) {
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
        parseInt(product.moq),
        product.brandName,
        product.url,
        product.product_image

      );

      // Reset form fields
      setProduct({
        productName: '',
        category: '',
        description: '',
        quantityPerUnit: '',
        unitPrice: '',
        unitsInStock: '',
        moq: '',
        brandName: '',
        url: '',
        product_image: ''
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
  const handleCsvSubmit = async (e) => {
    e.preventDefault();
    if (!csvFile) {
      setError('Please select a CSV file.');
      return;
    }
  
    const reader = new FileReader();
    reader.onload = async (event) => {
      const csvData = event.target.result;
      
      // Split CSV lines while considering quoted fields
      const productsArray = csvData.split('\n').map(line => {
        let fields = [];
        let currentField = '';
        let inQuotes = false;
        for (const char of line) {
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            fields.push(currentField);
            currentField = '';
          } else {
            currentField += char;
          }
        }
        fields.push(currentField); // Push the last field
        return fields;
      });
  
      // Remove the header row
      productsArray.shift();
  
      // Assuming CSV structure:
      // productName,category,description,quantityPerUnit,unitPrice,unitsInStock,moq,brandName,url
      const productsToAdd = [];
      let invalidProducts = [];
  
      for (const fields of productsArray) {
        const [
          productName,
          category,
          description,
          quantityPerUnit,
          unitPrice,
          unitsInStock,
          moq,
          brandName,
          url
        ] = fields;
  
        // Form validation
        if (
          !productName ||
          !category ||
          !quantityPerUnit ||
          !unitPrice ||
          !unitsInStock ||
          !description ||
          !moq ||
          !brandName
        ) {
          invalidProducts.push({ fields, reason: 'Missing fields' });
          continue;
        }
  
        if (parseFloat(unitPrice) <= 0 || parseInt(unitsInStock) <= 0 || parseInt(moq) <= 0) {
          invalidProducts.push({ fields, reason: 'Invalid values' });
          continue;
        }
  
        productsToAdd.push({
          productName,
          category,
          description,
          quantityPerUnit,
          unitPrice: parseFloat(unitPrice),
          unitsInStock: parseInt(unitsInStock),
          moq: parseInt(moq),
          brandName,
          url
        });
      }
  
      if (invalidProducts.length > 0) {
        setError(`Some products were not added due to invalid fields: ${JSON.stringify(invalidProducts)}`);
      }
  
      setLoading(true);
      setError('');
  
      try {
        for (const product of productsToAdd) {
          //  product.product_image= AddImageToStorage(product.product_image, selectedStore);
          // Add product to inventory
          let pid = await AddProductToInventory(
            selectedStore,
            product.productName,
            product.category,
            product.description,
            product.quantityPerUnit,
            product.unitPrice,
            product.unitsInStock,
            product.moq,
            product.brandName,
            product.url
          );
  
        }
  
        // Reset form fields
        setProduct({
          productName: '',
          category: '',
          description: '',
          quantityPerUnit: '',
          unitPrice: '',
          unitsInStock: '',
          moq: '',
          brandName: '',
          url: '',
          product_image: ''
        });
  
        // Provide feedback to the user
        message.success('Products added successfully!');
      } catch (error) {
        setError('Failed to add products. Please try again later.');
      } finally {
        setLoading(false);
      }
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
          <div className="import-csv-form-row">
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
          </div>
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
              label="Brand Name"
              name="brandName"
              value={product.brandName}
              onChange={handleChange}
              required
              fullWidth
            />
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

          <div className="form-group">
            <label>Upload Image:</label>
            <input type="file" onChange={(e) => { product.product_image = (e.target.files[0]); }} />
          </div>
          <div>
            OR
          </div>
          <div className="add-products-form-row">
            <TextField
              label="url"
              name="url"
              value={product.url}
              onChange={handleChange}
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
