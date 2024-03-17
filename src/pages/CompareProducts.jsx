import MainNavBar from "../components/MainNavBar";
import algoliasearch from "algoliasearch/lite";
import { useEffect, useState } from "react";
import { InstantSearch, SearchBox, Hits } from "react-instantsearch";
import { useAuth } from "../firebase/firebaseAuth";
import { FetchAllDistributorsForStore } from "../firebase/firebaseFirestore";
import ProductHitDetails from "../components/ProductHitDetails";
import "../styles/ProductHitDetails.css"
const CompareProducts = () => {
    const [searchClient, setSearchClient] = useState(null);
    const { currentUser } = useAuth();
    const [connectedDistributors, setConnectedDistributors] = useState([]);
    const [hits, setHits] = useState([]);
    const storeID = currentUser.selectedStore;

    useEffect(() => {
        const fetchDistributionStores = async () => {
            const distributors = await FetchAllDistributorsForStore(storeID);
            setConnectedDistributors(distributors);
        };

        fetchDistributionStores();
    }, [storeID]);

    // useEffect(() => {
    //     setSearchClient(algoliasearch('F3OFLXS7ZR', 'bae3813dadf5491de4dcf43446a50dbd'));
    // }, []);

    const hitsTest = [{
        distributorID: "Uv85bWXeqzOnlUndL5Om",
        distributorStoreName: "testDistribution1name",
        lastmodified: 1710175124150,
        moq: 2,
        objectID: "DtoWydESw9YelO4ik9iR",
        path: "Products/DtoWydESw9YelO4ik9iR",
        productDescription: "A sweet, aromatic syrup infused with the distinct flavor of anise seeds, perfect for adding depth to cocktails or desserts.",
        productName: "Aniseed Syrup",
        quantityPerUnit: "12 - 550 ml bottles",
        unitPrice: 10,
        unitsInStock: 5
    }, {
        distributorID: "no",
        distributorStoreName: "testDistribution1name",
        lastmodified: 1710175124150,
        moq: 2,
        objectID: "DtoWydESw9YelO4ik9iR",
        path: "Products/DtoWydESw9YelO4ik9iR",
        productDescription: "A sweet, aromatic syrup infused with the distinct flavor of anise seeds, perfect for adding depth to cocktails or desserts.",
        productName: "Aniseed Syrup",
        quantityPerUnit: "12 - 550 ml bottles",
        unitPrice: 10,
        unitsInStock: 5
    }, {
        distributorID: "no3",
        distributorStoreName: "testDistribution1name",
        lastmodified: 1710175124150,
        moq: 2,
        objectID: "DtoWydESw9YelO4ik9iR",
        path: "Products/DtoWydESw9YelO4ik9iR",
        productDescription: "A sweet, aromatic syrup infused with the distinct flavor of anise seeds, perfect for adding depth to cocktails or desserts.",
        productName: "Aniseed Syrup",
        quantityPerUnit: "12 - 550 ml bottles",
        unitPrice: 10,
        unitsInStock: 5
    }, {
        distributorID: "Uv85bWXeqzOnlUndL5Om",
        distributorStoreName: "testDistribution1name",
        lastmodified: 1710175124150,
        moq: 2,
        objectID: "DtoWydESw9YelO4ik9iR",
        path: "Products/DtoWydESw9YelO4ik9iR",
        productDescription: "A sweet, aromatic syrup infused with the distinct flavor of anise seeds, perfect for adding depth to cocktails or desserts.",
        productName: "Aniseed Syrup",
        quantityPerUnit: "12 - 550 ml bottles",
        unitPrice: 10,
        unitsInStock: 5
    }];

    return (
        <div>
            <MainNavBar />
            {/* <div>
                <h2>Connected Distributors</h2>
                {hitsTest.map((hit) => (
                    <div>
                        <ProductHitDetails hit={hit} showConnectedHits={true} connectedDistributors={connectedDistributors} />
                    </div>
                ))}

            </div>

            <div>
                <h2>Other Distributors</h2>
                {hitsTest.map((hit) => (
                    <div>
                        <ProductHitDetails hit={hit} showConnectedHits={false} connectedDistributors={connectedDistributors} />
                    </div>
                ))}

            </div>          */}

            {searchClient && (
                <div>
                    <div className="mx-auto w-fit">
                        <InstantSearch searchClient={searchClient} indexName="products">
                            <SearchBox placeholder={'Browse Products'} searchAsYouType={false} />
                            <div>
                                <h2>Connected Distributor Hits</h2>
                                <Hits hitComponent={(hit) => <ProductHitDetails {...hit} showConnectedHits={true} connectedDistributors={connectedDistributors} className="hits-list"/>} />
                            </div>
                            <div>
                                <h2>Other Distributor Lists</h2>
                                <Hits hitComponent={(hit) => <ProductHitDetails {...hit} showConnectedHits={false} connectedDistributors={connectedDistributors} className="hits-list" />} />
                            </div>
                        </InstantSearch>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompareProducts;
