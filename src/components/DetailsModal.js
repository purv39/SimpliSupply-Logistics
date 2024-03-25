import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const FlexContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const FlexItem = styled.div`
  flex: 1;
  margin-left: 1rem;
`;

const Label = styled.label`
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  margin-bottom: 1rem;
  color: #666;
`;

const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  z-index: 100;
`;

const ModalContent = styled.div`
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalCloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #6c63ff;
  }
`;

const DetailsModal = ({ isOpen, onClose, product }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <ModalContainer>
                <ModalCloseButton onClick={onClose}>×</ModalCloseButton>
                <ModalContent>
                    <FlexContainer>
                        <FlexItem>
                            <img
                                src="https://target.scene7.com/is/image/Target/GUEST_ba963a5a-ff10-43c3-a3c6-1deb83f24990"
                                alt="Product"
                                onError={(event) => {
                                    event.target.onerror = null;
                                    event.target.src = 'https://via.placeholder.com/150'; // Replace with your own default image URL
                                }}
                            />
                        </FlexItem>
                        <FlexItem>
                            <h2>
                                {product.data.productName}
                                {' '}
                                (
                                {product.data.quantityPerUnit}
                                {product.data.unit})
                            </h2>
                            <p>
                              {product.data?.brandName}
                            </p>
                            <p>
                                ${product.data.unitPrice}
                            </p>
                            <Description>{product.data.productDescription}</Description>
                            <Label>Category:</Label>
                            <p>{product.data.categoryName}</p>
                            <Label>Description :</Label>
                            <p>{product.data.productDescription ? product.data.productDescription : 'N/A'}</p>
                        </FlexItem>
                    </FlexContainer>
                </ModalContent>
            </ModalContainer>
        </motion.div>
    );
};



export default DetailsModal;