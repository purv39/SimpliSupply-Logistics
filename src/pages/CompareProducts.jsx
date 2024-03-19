import MainNavBar from "../components/MainNavBar";
import algoliasearch from "algoliasearch/lite";
import { useEffect, useState } from "react";
import { InstantSearch, SearchBox, Hits } from "react-instantsearch";
import { useAuth } from "../firebase/firebaseAuth";
import { FetchAllDistributorsForStore } from "../firebase/firebaseFirestore";
import "../styles/CompareProducts.css";
import { Switch, Typography } from "antd";
import 'instantsearch.css/themes/algolia-min.css';
import ConnectedDistributorsProductHits from "../components/ConnectedDistributorsProductHits";
import OtherDistributorsProductHits from "../components/OtherDistributorsProductHits";

const CompareProducts = () => {
    const { currentUser } = useAuth();
    const [connectedDistributors, setConnectedDistributors] = useState([]);
    const storeID = currentUser.selectedStore;
    const [showConnected, setShowConnected] = useState(true); // State to track the current view mode
    const searchClient = algoliasearch(
        'F3OFLXS7ZR',
        'bae3813dadf5491de4dcf43446a50dbd'
      );
    useEffect(() => {
        const fetchDistributionStores = async () => {
            const distributors = await FetchAllDistributorsForStore(storeID);
            setConnectedDistributors(distributors);
        };

        fetchDistributionStores();
    }, [storeID]);

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
                        <InstantSearch searchClient={searchClient} indexName="products" future={{
                            preserveSharedStateOnUnmount: true,
                        }}>
                            <div className="search-box-container">
                                <SearchBox placeholder={'Browse Products'} searchAsYouType={true} className="custom-searchbox" />
                            </div>
                            <div className="toggle-container">
                                <h4>Toggle Connected Distributors</h4>
                                <Switch onChange={handleToggle} defaultChecked />
                            </div>

                            <div>
                                <h2 className="hits-heading"> {showConnected ? ("Connected Distributor Hits") : ("Other Distributors Hits")}</h2>
                                <Hits
                                    hitComponent={(hit) => {
                                        if (connectedDistributors !== undefined) {
                                            const isConnected = connectedDistributors.some(distributor => distributor.id === hit.hit.distributorID);
                                            if (isConnected && showConnected) {
                                                return <ConnectedDistributorsProductHits {...hit} />;
                                            } else if (!isConnected && !showConnected) {
                                                console.log("here");
                                                return <OtherDistributorsProductHits {...hit} />;
                                            }
                                        }
                                        else if(!showConnected) {
                                            return <OtherDistributorsProductHits {...hit} />;
                                        }
                                    }}
                                />
                            </div>

                        </InstantSearch>
                    </div>
                )}
            </div>
        </div >
    );
};

export default CompareProducts;