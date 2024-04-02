import { useRef, useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import { GenerateSKULabelForProduct } from '../firebase/firebaseFirestore';
import { useAuth } from '../firebase/firebaseAuth';
import { message, Modal } from 'antd';
import MainNavBar from '../components/MainNavBar';
import '../styles/AddProducts.css';
import Barcode from 'react-barcode'; // Import Barcode component
import html2canvas from 'html2canvas';
const GenerateSKULabel = () => {
    const { currentUser } = useAuth();
    const selectedStore = currentUser.selectedStore;

    const [product, setProduct] = useState({
        productName: '',
        category: '',
        description: '',
        quantityPerUnit: '',
        unitPrice: '',
        unitsInStock: '',
        itemRetailPrice: '',
        brandName: '',
        url: '',
        product_image: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [csvFile, setCsvFile] = useState(null);
    const [productId, setProductId] = useState(null); // State to store the generated product ID
    const [barcodeModalVisible, setBarcodeModalVisible] = useState(false); // State for barcode modal visibility
    const barcodeRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value)
        setProduct({ ...product, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setCsvFile(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Form validation
        if (!product.productName || !product.category || !product.quantityPerUnit || !product.unitPrice || !product.unitsInStock || !product.description || !product.itemRetailPrice || !product.itemRetailPrice || !product.brandName) {
            setError('Please fill out all fields.');
            return;
        }

        if (parseFloat(product.unitPrice) <= 0 || parseInt(product.unitsInStock) < 0 || parseFloat(product.itemRetailPrice) <= 0) {
            setError('Unit price, units in stock, and retail price must be positive numbers.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Add product to inventory
            const addedProductId = await GenerateSKULabelForProduct(
                selectedStore,
                product.productName,
                product.brandName,
                product.category,
                product.description,
                product.quantityPerUnit,
                parseFloat(product.unitPrice),
                parseInt(product.unitsInStock),
                parseInt(product.itemRetailPrice),
                product.url,
                product.product_image
            );

            // Set the generated product ID
            setProductId(addedProductId);

            // Reset form fields
            setProduct({
                productName: '',
                category: '',
                description: '',
                quantityPerUnit: '',
                unitPrice: '',
                unitsInStock: '',
                itemRetailPrice: '',
                brandName: '',
                url: '',
                product_image: ''
            });

            handleShowBarcodeModal()
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


    const handleShowBarcodeModal = () => {
        setBarcodeModalVisible(true);
    };

    const handleBarcodeModalClose = () => {
        setBarcodeModalVisible(false);
    };

    const handleDownloadImage = async () => {
        const element = document.getElementById('print'),
            canvas = await html2canvas(element),
            data = canvas.toDataURL('image/jpg'),
            link = document.createElement('a');

        link.href = data;
        link.download = 'downloaded-image.jpg';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
              retailPrice,
              unitsInStock,
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
              !retailPrice ||
              !brandName
            ) {
              invalidProducts.push({ fields, reason: 'Missing fields' });
              continue;
            }
      
            if (parseFloat(unitPrice) <= 0 || parseInt(unitsInStock) <= 0 || parseFloat(retailPrice) <= 0) {
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
              retailPrice: parseFloat(retailPrice),
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
              let pid = await GenerateSKULabelForProduct(
                selectedStore,
                product.productName,
                product.brandName,
                product.category,
                product.description,
                product.quantityPerUnit,
                product.unitPrice,
                product.unitsInStock,
                product.retailPrice,
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
                    Generate SKU
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
                            label="Brand"
                            name="brandName"
                            value={product.brandName}
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
                            label="Item Retail Price"
                            name="itemRetailPrice"
                            type="number"
                            value={product.itemRetailPrice}
                            onChange={handleChange}
                            required
                            fullWidth
                        />
                    </div>
                    <div className="add-products-form-row">

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
            {/* Barcode modal */}
            <Modal
                title="Generated Barcode"
                visible={barcodeModalVisible}
                onCancel={handleBarcodeModalClose}
                footer={[
                    <Button key="download" onClick={handleDownloadImage} type="primary">
                        Download
                    </Button>,
                    <Button key="close" onClick={handleBarcodeModalClose}>
                        Close
                    </Button>
                ]}
                style={{ display: "flex", justifyContent: "center" }}


            >
                <div className="barcode-container">
                    <Typography variant="h6">Barcode:</Typography>
                    <div id="print" style={{ display: "inline-block" }}>
                        <Barcode value={productId} ref={barcodeRef} /> {/* Attach ref to Barcode component */}
                    </div>

                </div>
            </Modal>
        </div>
    );
};

export default GenerateSKULabel;
