import { useEffect, useState } from "react";
import "../styles/ProductHitDetails.css";

const ProductHitDetails = ({ hit, showConnectedHits, connectedDistributors }) => {
    const [displayHit, setDisplayHit] = useState(false);

    useEffect(() => {
        // Check if any connected distributors exist
        const isConnected = connectedDistributors.some(distributor => distributor.id === hit.distributorID);

        // Update displayHit state based on the result and the value of showConnectedHits
        if (showConnectedHits) {
            setDisplayHit(isConnected);
        } else {
            setDisplayHit(!isConnected);
        }
    }, [showConnectedHits, connectedDistributors, hit.distributorID]);

    // Render null if hit is not connected or if there are no connected distributors
    if (!displayHit || connectedDistributors.length === 0) return null;

    // If hit is connected, render the hit details with styling and a "Create Order" button
    return (
        <div className="product-catalog-item">
            <div className="product-name">{hit.productName}</div>

            <div className="product-brand">{hit.distributorStoreName}</div>
            <div className="product-quantity">Quantity Per Unit: {hit.quantityPerUnit}</div>
            <div className="product-price">Price: ${hit.unitPrice}</div>
            <button className="create-order-button">Create Order</button>
        </div>
    );
};

export default ProductHitDetails;
