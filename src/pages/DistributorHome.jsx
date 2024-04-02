import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap
import "../styles/StoreHome.css";
import MainNavBar from '../components/MainNavBar';
import { useAuth } from '../firebase/firebaseAuth';
import { FetchDistributorsInfo } from '../firebase/firebaseFirestore';
import { RiseLoader } from 'react-spinners'; // Import RingLoader from react-spinners
import "../styles/LoadingSpinner.css";
import { Typography, Pagination } from 'antd'; // Import Pagination from antd
import DetailsModal from '../components/DetailsModal'; // Import DetailsModal component
import { SwapVert } from '@mui/icons-material';

const DistributorHome = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true); // State for loading status
    const { currentUser } = useAuth();
    const distributionStoreID = currentUser.selectedStore;
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
    const [selectedProduct, setSelectedProduct] = useState(null); // State for selected product
    const [currentPage, setCurrentPage] = useState(1); // State for current page
    const [itemsPerPage, setItemsPerPage] = useState(10); // Number of items per page
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const [sortBy, setSortBy] = useState(null); // State for sorting column
    const [sortOrder, setSortOrder] = useState('asc'); // State for sorting order

    useEffect(() => {
        const fetchInventory = async () => {
            const inventoryData = await FetchDistributorsInfo([distributionStoreID]);
            setInventory(inventoryData[0].data.productsData);
            setLoading(false); // Set loading to false when data is fetched
        }

        fetchInventory();
    }, [distributionStoreID]);

    const handleOpenModal = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    }

    // Logic to get current items based on pagination and search query
    let filteredItems = inventory?.filter(item =>
        item.data.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sorting logic
    if (sortBy) {
        filteredItems.sort((a, b) => {
            const valueA = a.data[sortBy];
            const valueB = b.data[sortBy];

            if (valueA < valueB) {
                return sortOrder === 'asc' ? -1 : 1;
            }
            if (valueA > valueB) {
                return sortOrder === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }

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

    // Handle sorting
    const handleSort = (column) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
    };

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
                    className="search-input"
                />
                {loading ? (
                    <div className="loading-spinner">
                        <RiseLoader color="#36D7B7" loading={loading} size={10} />
                    </div>
                ) : inventory.length === 0 ? (
                    <Typography>No items in inventory</Typography>
                ) : (
                    <>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th onClick={() => handleSort('productName')}>Product Name <SwapVert fontSize='xs' style={{cursor: "pointer"}}/></th>
                                    <th onClick={() => handleSort('categoryName')}>Category <SwapVert fontSize='xs' style={{cursor: "pointer"}}/></th>
                                    <th onClick={() => handleSort('quantityPerUnit')}>Quantity Per Unit <SwapVert fontSize='xs' style={{cursor: "pointer"}}/></th>
                                    <th onClick={() => handleSort('unitsInStock')}>Units In Stock <SwapVert fontSize='xs' style={{cursor: "pointer"}}/></th>
                                    <th onClick={() => handleSort('unitPrice')}>Unit Price <SwapVert fontSize='xs' style={{cursor: "pointer"}}/></th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.data.productName}</td>
                                        <td>{item.data.categoryName}</td>
                                        <td>{item.data.quantityPerUnit}</td>
                                        <td>{item.data.unitsInStock}</td>
                                        <td>${item.data.unitPrice.toFixed(2)}</td> {/* Display with 2 decimal points if not an integer */}
                                        <td>
                                            <button className="btn btn-primary" onClick={() => handleOpenModal(item)}>
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
                                showSizeChanger
                                onShowSizeChange={(current, pageSize) => setItemsPerPage(pageSize)}
                            />
                        </div>
                        <DetailsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} product={selectedProduct} />
                    </>
                )}
            </div>
        </div>
    );
};

export default DistributorHome;
