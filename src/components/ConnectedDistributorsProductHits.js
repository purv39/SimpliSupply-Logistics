import { useNavigate } from "react-router-dom";
import "../styles/ProductHitDetails.css";

const ConnectedDistributorsProductHits = ({ hit }) => {
    const navigate = useNavigate();
    const distributorID = hit.distributorID;
    const createOrderForDistributor = () => {
        navigate(`/CreateNewOrder/${distributorID}`)
    }
    return (
        <div className="product-catalog-item">
            <div className="product-name">{hit.productName}</div>
            <div className="product-brand" onClick={createOrderForDistributor}>{hit.distributorStoreName}</div>
            <div className="product-quantity">Quantity Per Unit: {hit.quantityPerUnit}</div>
            <div className="product-price">Price: ${hit.unitPrice}</div>
            <button className="create-order-button">Create Order</button>
        </div>
    );
};

export default ConnectedDistributorsProductHits;
