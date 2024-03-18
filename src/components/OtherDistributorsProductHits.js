import "../styles/ProductHitDetails.css";

const OtherDistributorsProductHits = ({ hit }) => {

    return (
        <div className="product-catalog-item">
            <div className="product-name">{hit.productName}</div>
            <div className="product-brand">{hit.distributorStoreName}</div>
            <div className="product-quantity">Quantity Per Unit: {hit.quantityPerUnit}</div>
            <div className="product-price">Price: ${hit.unitPrice}</div>
            <button className="create-order-button">Connect</button>
        </div>
    );
};

export default OtherDistributorsProductHits;
