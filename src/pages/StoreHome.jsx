import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap
import "../styles/StoreHome.css";
import MainNavBar from '../components/MainNavBar';
import { useAuth } from '../firebase/firebaseAuth';
import { FetchStoreInventory } from '../firebase/firebaseFirestore';
import { RiseLoader } from 'react-spinners'; // Import RingLoader from react-spinners
import "../styles/LoadingSpinner.css";
import { Typography } from '@mui/material';
import { Pagination } from 'antd';
import DetailsModal from '../components/DetailsModal';

const StoreHome = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading status
  const { currentUser } = useAuth();
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [itemsPerPage, setItemsPerPage] = useState(8); // Number of items per page
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [selectedProduct, setSelectedProduct] = useState(null); // State for selected product


  const storeID = currentUser.selectedStore;

  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      const inventoryData = await FetchStoreInventory(storeID);
      setInventory(inventoryData);
      setLoading(false); // Set loading to false when data is fetched
    }

    fetchInventory();
  }, [storeID]);

  const handleOrder = (productId) => {
    // Implement logic to handle order
    console.log(`Order placed for product ID: ${productId}`);
  };

  // Logic to get current items based on pagination and search query
  const filteredItems = inventory.filter(item =>
    item?.data?.productName?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems?.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const onPageChange = (page) => setCurrentPage(page);

  // Handle search input change
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
}

  return (
    <div className="dashboard">
      <MainNavBar />
      <div className="content">
        <h2>Inventory</h2>
        <input
          type="text"
          placeholder="Browse Products"
          value={searchQuery}
          onChange={handleSearchInputChange}
          className='search-input'
        />
        {loading ? (
          <div className="loading-spinner">
            <RiseLoader color="#36D7B7" loading={loading} size={10} />
          </div>
        ) : filteredItems.length === 0 ? (
          <Typography>No items found</Typography>
        ) : (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Quantity Per Unit</th>
                  <th>Units In Stock</th>
                  <th>Unit Price</th>
                  <th>Item Retail Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.data.productName}</td>
                    <td>{item.data.categoryName}</td>
                    <td>{item.data.quantityPerUnit}</td>
                    <td>{item.data.unitsInStock}</td>
                    <td>${item.data.unitPrice % 1 === 0 ? item.data.unitPrice?.toFixed(2) : item.data?.unitPrice}</td> {/* Display with 2 decimal points if not an integer */}
                    <td>${item.data.itemRetailPrice?.toFixed(2)}</td>
                    <td>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleOpenModal(item)}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className='pagination-container'>
              <Pagination
                current={currentPage}
                pageSize={itemsPerPage}
                total={filteredItems.length}
                onChange={onPageChange}
                showQuickJumper
              />
            </div>
            <DetailsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} product={selectedProduct} />

          </>
        )}
      </div>
    </div>
  );
};

export default StoreHome;
