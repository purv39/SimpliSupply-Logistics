import { useState } from 'react';
import { TextField, Button } from '@mui/material'; // Import form components from Material-UI
import { AddProductToInventory } from '../firebase/firebaseFirestore'; // Import function to add product to database

const AddProducts = ({ selectedStore }) => {
  const [product, setProduct] = useState({
    productName: '',
    category: '',
    quantityPerUnit: '',
    unitPrice: '',
    unitsInStock: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = () => {
    // Add product to inventory
    AddProductToInventory(
      selectedStore, // Use selectedStore as distributorID
      product.productName,
      product.category,
      product.quantityPerUnit,
      product.unitPrice,
      product.unitsInStock
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
    alert('Product added successfully!');
  };

  return (
    <div>
      <h2>Add Products</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Product Name"
          name="productName"
          value={product.productName}
          onChange={handleChange}
          required
        />
        <TextField
          label="Category"
          name="category"
          value={product.category}
          onChange={handleChange}
          required
        />
        <TextField
          label="Quantity Per Unit"
          name="quantityPerUnit"
          value={product.quantityPerUnit}
          onChange={handleChange}
          required
        />
        <TextField
          label="Unit Price"
          name="unitPrice"
          value={product.unitPrice}
          onChange={handleChange}
          required
        />
        <TextField
          label="Units In Stock"
          name="unitsInStock"
          value={product.unitsInStock}
          onChange={handleChange}
          required
        />
        <Button type="submit" variant="contained" color="primary">Add Product</Button>
      </form>
    </div>
  );
};

export default AddProducts;
