import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap
import "../styles/StoreHome.css";
import MainNavBar from '../components/MainNavBar';
import { useAuth } from '../firebase/firebaseAuth';
import { FetchDistributorsInfo } from '../firebase/firebaseFirestore';
import { RiseLoader } from 'react-spinners'; // Import RingLoader from react-spinners
import "../styles/LoadingSpinner.css";

const DistributorHome = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true); // State for loading status
    const { currentUser } = useAuth();
    const distributionStoreID = currentUser.selectedStore;

    useEffect(() => {
        const fetchInventory = async () => {
            const inventoryData = await FetchDistributorsInfo([distributionStoreID]);
            console.log(inventoryData[0].data.productsData)
            setInventory(inventoryData[0].data.productsData);
            setLoading(false); // Set loading to false when data is fetched
        }

        fetchInventory();
    }, [distributionStoreID]);

    return (
        <div className="dashboard">
            <MainNavBar />
            <div className="content">
                <h2>Inventory</h2>
                {loading ? (
                    <div className="loading-spinner">
                        <RiseLoader color="#36D7B7" loading={loading} size={10} />
                    </div>
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Category</th>
                                <th>Quantity Per Unit</th>
                                <th>Units In Stock</th>
                                <th>Unit Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventory.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.data.productName}</td>
                                    <td>{item.data.categoryName}</td>
                                    <td>{item.data.quantityPerUnit}</td>
                                    <td>{item.data.unitsInStock}</td>
                                    <td>{item.data.unitPrice}</td>                        
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default DistributorHome;
