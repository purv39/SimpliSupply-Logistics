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

    // If hit is connected, render the hit details with styling
    return (
        <div className="hit-container">
            <div className="hit-item">
                <div className="hit-label">Distributor Name:</div>
                <div className="hit-value">{hit.distributorStoreName}</div>
            </div>
            <div className="hit-item">
                <div className="hit-label">Distributor ID:</div>
                <div className="hit-value">{hit.distributorID}</div>
            </div>
            <div className="hit-item">
                <div className="hit-label">Product Name:</div>
                <div className="hit-value">{hit.productName}</div>
            </div>
            <div className="hit-item">
                <div className="hit-label">Description:</div>
                <div className="hit-value">{hit.productDescription}</div>
            </div>
            <div className="hit-item">
                <div className="hit-label">Price:</div>
                <div className="hit-value">${hit.unitPrice}</div>
            </div>
            <div className="hit-item">
                <div className="hit-label">Units in Stock:</div>
                <div className="hit-value">{hit.unitsInStock}</div>
            </div>
            <div className="hit-item">
                <div className="hit-label">MOQ:</div>
                <div className="hit-value">{hit.moq}</div>
            </div>
        </div>
    );
};

export default ProductHitDetails;
