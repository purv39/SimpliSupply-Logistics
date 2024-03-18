import MainNavBar from "../components/MainNavBar";
import algoliasearch from "algoliasearch/lite";
import { useEffect, useState } from "react";
import { InstantSearch, SearchBox, Hits } from "react-instantsearch";
import { useAuth } from "../firebase/firebaseAuth";
import { FetchAllDistributorsForStore } from "../firebase/firebaseFirestore";
import ProductHitDetails from "../components/ProductHitDetails";
import "../styles/CompareProducts.css";
import { Switch } from "antd";
import 'instantsearch.css/themes/algolia-min.css';

const CompareProducts = () => {
    const [searchClient, setSearchClient] = useState(null);
    const { currentUser } = useAuth();
    const [connectedDistributors, setConnectedDistributors] = useState([]);
    const [hits, setHits] = useState([]);
    const storeID = currentUser.selectedStore;
    const [showConnected, setShowConnected] = useState(true); // State to track the current view mode

    useEffect(() => {
        const fetchDistributionStores = async () => {
            const distributors = await FetchAllDistributorsForStore(storeID);
            setConnectedDistributors(distributors);
        };

        fetchDistributionStores();
    }, [storeID]);

    useEffect(() => {
        setSearchClient(algoliasearch('F3OFLXS7ZR', 'bae3813dadf5491de4dcf43446a50dbd'));
    }, []);

    const handleToggle = () => {
        setShowConnected(prev => !prev); // Toggle the state
    };

    return (
        <div>
            <MainNavBar />

            <div className="compare-products-container">
                <h1 className="compare-products-heading">Compare Products</h1>

                {searchClient && (
                    <div className="search-container">
                        <InstantSearch searchClient={searchClient} indexName="products">
                            <div className="search-box-container">
                                <SearchBox placeholder={'Browse Products'} searchAsYouType={false} className="custom-searchbox" />
                            </div>
                            <div className="toggle-container">
                                <h4>Toggle Connected Distributors</h4>
                                <Switch onChange={handleToggle} defaultChecked />
                            </div>

                            {showConnected ? (
                                <div>
                                    <h2 className="hits-heading">Connected Distributor Hits</h2>
                                    <Hits hitComponent={(hit) => <ProductHitDetails {...hit} showConnectedHits={true} connectedDistributors={connectedDistributors}  />} />
                                </div>
                            ) : (
                                <div>
                                    <h2 className="hits-heading">Other Distributor Lists</h2>
                                    <Hits hitComponent={(hit) => <ProductHitDetails {...hit} showConnectedHits={false} connectedDistributors={connectedDistributors}  />} />
                                </div>
                            )}
                        </InstantSearch>
                    </div>
                )}
            </div>
        </div>

    );
};

export default CompareProducts;
