import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../firebase/firebaseAuth';

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
  const [imageUrl, setImageUrl] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchImage = async () => {
      try {
        // Make a GET request to fetch the image data
        if (product?.data?.productImageURL) {
          const response = await axios.get(product?.data?.productImageURL, {
            headers: {
              Authorization: `Bearer ${currentUser?.user?.stsTokenManager?.accessToken}`, // Replace with your authentication token
            },
            responseType: 'blob', // Response type is blob since it's an image
          });

          // Create a blob URL from the image data
          if (response.data) {
            const blobUrl = URL.createObjectURL(response.data);
            setImageUrl(blobUrl);
          }
        } else {
          setImageUrl(product?.data?.url)
        }


      } catch (error) {
        console.error('Error fetching image:', error);
      }
    };

    if (isOpen) {
      fetchImage();
    }
  }, [isOpen, product?.data?.url]);

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
              style={{width: '300px', height: '300px'}}
                src={imageUrl || 'https://via.placeholder.com/150'} // Use imageUrl or placeholder if not available
                alt="Product"
              />
            </FlexItem>
            <FlexItem>
              <h2>
                {product.data.productName} ({product.data.quantityPerUnit} {product.data.unit})
              </h2>
              <p>{product.data?.brandName}</p>
              <p>${product.data.unitPrice}</p>
              <Label>Category:</Label>
              <p>{product.data.categoryName}</p>
              <Label>Description:</Label>
              <p>{product.data.productDescription || 'N/A'}</p>
            </FlexItem>
          </FlexContainer>
        </ModalContent>
      </ModalContainer>
    </motion.div>
  );
};


export default DetailsModal;
