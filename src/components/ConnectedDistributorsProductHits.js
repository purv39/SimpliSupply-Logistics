import "../styles/ProductHitDetails.css";
import { useState } from "react";
import ProductDetailsModal from "../pages/ProductDetailsModal";
import { InfoOutlined, Launch } from "@mui/icons-material";

const ConnectedDistributorsProductHits = ({ hit }) => {
    const distributorID = hit.distributorID;
    
    const navigateToCreateOrder = () => {
        window.open(`/CreateNewOrder/${distributorID}`, "_blank"); // Open in new tab
    };

    const [visible, setVisible] = useState(false);

    const showModal = () => {
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const createOrderForDistributor = () => {
        showModal();
    };

    return (
        <div className="product-catalog-item">
            <div className="product-name">{hit.productName} <InfoOutlined onClick={createOrderForDistributor} style={{cursor: "pointer"}}/> </div>
            <div className="product-brand">
                {hit.distributorStoreName}   
                <Launch 
                    onClick={navigateToCreateOrder} 
                    style={{fontSize: "medium", color: "blue", cursor: "pointer", marginLeft: "4px", marginRight: "-5px" }} 
                />
            </div>
            <div className="product-quantity">Quantity Per Unit: {hit.quantityPerUnit}</div>
            <div className="product-quantity">MOQ: {hit.moq}</div>
            <div className="product-price">Price: ${hit.unitPrice?.toFixed(2)}</div>
            <button className="create-order-button" onClick={createOrderForDistributor}>Create Order</button>
            <ProductDetailsModal visible={visible} handleCancel={handleCancel} hit={hit} connected={true}/>
        </div>
    );
};

export default ConnectedDistributorsProductHits;
