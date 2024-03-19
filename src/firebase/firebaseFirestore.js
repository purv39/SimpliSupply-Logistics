import { db } from "./firebaseConfig";
import { collection, doc, setDoc, addDoc, deleteDoc, updateDoc, arrayUnion, getDocs, getDoc, query, where, arrayRemove, runTransaction } from 'firebase/firestore';
import { AddTaxFileToStorage } from "./firebaseStorage";

export const AddNewUserToFirestore = (uuid, email, firstName, lastName, contactNumber, address, city, zipCode, province, role) => {
    let storeOperator = false;
    let distributor = false;
    if (role === 'Store') {
        storeOperator = true;
    } else if (role === 'Distributor') {
        distributor = true;
    }

    // Construct the role object
    const roleObject = {
        storeOperator: storeOperator,
        distributor: distributor
    };
    const userRef = doc(collection(db, 'Users'), uuid);

    return setDoc(userRef, {
        email: email,
        firstName: firstName,
        lastName: lastName,
        contactNumber: contactNumber,
        address: address,
        city: city,
        postalCode: zipCode,
        province: province,
        roles: roleObject,
        verified: false,
        storesList: [],
        distributionStores: []
    });
}

// Function to add a new store for operator
export const AddNewDistributionStoreForOperator = async (uuid, storeName, businessNumber, gstNumber, taxFile, storeContactNumber, storeAddress, storeCity, storePostalCode, storeProvince) => {
    try {
        const docRef = await addDoc(collection(db, 'Distribution Stores'), {
            storeOperator: uuid,
            storeName: storeName,
            businessNumber: businessNumber,
            gstNumber: gstNumber,
            storeContactNumber: storeContactNumber,
            storeAddress: storeAddress,
            storeCity: storeCity,
            storePostalCode: storePostalCode,
            storeProvince: storeProvince,
            taxFileURL: "",
            rating: 0,
            invites: [],
            storesConnected: [],
        });

        const newDistributorID = docRef.id;

        AddTaxFileToStorage(taxFile, newDistributorID).then(async (dwnldurl) => {
            const distributorDocRef = doc(db, 'Distribution Stores', newDistributorID);
            await updateDoc(distributorDocRef, {
                taxFileURL: dwnldurl
            });
        })

        // Update the distributionOrders array in the Users collection
        const userDocRef = doc(db, 'Users', uuid);
        await updateDoc(userDocRef, {
            distributionStores: arrayUnion(newDistributorID)
        });

        return newDistributorID;
    } catch (error) {
        console.error("Error adding document: ", error);
        throw error;
    }
}

// Function to add a new product to the distributor's inventory
export const AddProductToInventory = async (distributorID, productName, category, productDescription, quantityPerUnit, unitPrice, unitsInStock, moq) => {
    try {
        // Construct the product object
        const productData = {
            productName: productName,
            categoryName: category,
            productDescription: productDescription,
            moq: moq,
            quantityPerUnit: quantityPerUnit,
            unitPrice: unitPrice,
            unitsInStock: unitsInStock
        };

        // Add the product to the "products" subcollection of the distributor
        const distributorRef = doc(db, 'Distribution Stores', distributorID);
        const productRef = await addDoc(collection(distributorRef, 'products'), productData);

        console.log("Product added successfully:", productRef.id);
        return productRef.id; // Return the ID of the added product
    } catch (error) {
        console.error("Error adding product:", error);
        throw error; // Throw error for handling in UI or higher-level components
    }
};

// Function to add a new store for operator
export const AddNewStoreForOperator = async (uuid, storeName, businessNumber, gstNumber, taxFile, storeContactNumber, storeAddress, storeCity, storePostalCode, storeProvince) => {
    try {
        const docRef = await addDoc(collection(db, 'Retail Stores'), {
            storeOperator: uuid,
            storeName: storeName,
            businessNumber: businessNumber,
            gstNumber: gstNumber,
            storeContactNumber: storeContactNumber,
            storeAddress: storeAddress,
            storeCity: storeCity,
            storePostalCode: storePostalCode,
            storeProvince: storeProvince,
            taxFileURL: "",
            rating: 0,
            invites: [],
            distributorsConnected: [],
        });

        const newStoreID = docRef.id;


        AddTaxFileToStorage(taxFile, newStoreID).then(async (dwnldurl) => {
            const storeDocRef = doc(db, 'Retail Stores', newStoreID);
            await updateDoc(storeDocRef, {
                taxFileURL: dwnldurl
            });
        })

        // Update the storesList array in the Users collection
        const userDocRef = doc(db, 'Users', uuid);
        await updateDoc(userDocRef, {
            storesList: arrayUnion(newStoreID)
        });

        return newStoreID;
    } catch (error) {
        console.error("Error adding document: ", error);
        throw error;
    }
}

// Function to add a new Invitation for store
export const AddInvitation = async (distributorID, storeID) => {
    try {
        const invitationRef = await addDoc(collection(db, 'Invitations'), {
            createdAt: new Date(),
            distributorID: distributorID,
            storeID: storeID,
            pending: false,
        });

        const storeRef = doc(db, 'Retail Stores', storeID);
        await updateDoc(storeRef, {
            invites: arrayUnion(invitationRef.id)
        });

        const distributorRef = doc(db, 'Distribution Stores', distributorID);
        await updateDoc(distributorRef, {
            invites: arrayUnion(invitationRef.id)
        });

        return invitationRef.id;
    } catch (error) {
        console.error("Error creating invitation:", error);
    }
}

export const FetchInvitationsForStore = async (storeID) => {
    try {
      const invitationsRef = collection(db, 'Invitations');
      const q = query(invitationsRef, where("storeID", "==", storeID));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching invitations for store:", error);
      throw error;
    }
  };

  export const RemoveInvitation = async (invitationId) => {
    try {
      await deleteDoc(doc(db, 'Invitations', invitationId));
      console.log(`Invitation with ID ${invitationId} has been removed.`);
    } catch (error) {
      console.error('Error removing invitation:', error);
      throw new Error(error);
    }
  };


export const FetchInvitationsForDistributor = async (distributorID) => {
    try {
        const distributorRef = doc(db, 'Distribution Stores', distributorID);
        const distributorSnap = await getDoc(distributorRef);
        if (distributorSnap.exists()) {
            const invites = distributorSnap.data().invites;
            if (invites.length > 0) {
                const invitationsData = [];
                for (const invitationId of invites) {
                    const invitationRef = doc(db, 'Invitations', invitationId);
                    const invitationSnap = await getDoc(invitationRef);
                    if (invitationSnap.exists()) {
                        invitationsData.push({
                            id: invitationSnap.id,
                            data: invitationSnap.data()
                        });
                    } else {
                    }
                }
                return invitationsData;
            } else {
            }
        } else {
        }
    } catch (error) {
        throw error;
    }
};

export const FetchDistributorStore = async () => {
    try {
        const storeRef = collection(db, 'Distribution Stores');
        const storeSnap = await getDocs(storeRef);
        console.log("Fetched stores: ", storeSnap.docs.map(doc => doc.data())); // Debug log
        return storeSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error fetching distribution stores:', error);
    }
}

// Function to accept an invitation
export const AcceptInvitation = async (distributorID, storeID, invitationID) => {
    try {
        const distributorRef = doc(db, 'Distribution Stores', distributorID);
        await updateDoc(distributorRef, {
            invites: arrayRemove(invitationID), // Remove the store from the invites array
            storesConnected: arrayUnion(storeID) // Add the store to the storesConnected array
        });

        const storeRef = doc(db, 'Retail Stores', storeID);
        await updateDoc(storeRef, {
            invites: arrayRemove(invitationID), // Remove the distributor from the invitations array
            distributorsConnected: arrayUnion(distributorID) // Add the distributor to the distributorsConnected array
        });

        // Delete the invitation document
        const invitationRef = doc(db, 'Invitations', invitationID);
        await deleteDoc(invitationRef);

        return true;
    } catch (error) {
        console.error('Error accepting invitation:', error);
        throw error;
    }
};

export const FetchDistributionStoreDetails = async (storeId) => {
    try {
        const storeRef = doc(db, 'Distribution Stores', storeId);
        const storeSnap = await getDoc(storeRef);

        if (storeSnap.exists()) {
            return { id: storeSnap.id, ...storeSnap.data() };
        } else {
            throw new Error('Distribution store details not found.');
        }
    } catch (error) {
        console.error('Error fetching distribution store details:', error);
    }
}

// Function to decline an invitation
export const DeclineInvitation = async (distributorID, storeID, invitationID) => {
    try {
        const distributorRef = doc(db, 'Distribution Stores', distributorID);
        await updateDoc(distributorRef, {
            invites: arrayRemove(invitationID) // Remove the store from the invites array
        });

        const storeRef = doc(db, 'Retail Stores', storeID);
        await updateDoc(storeRef, {
            invites: arrayRemove(invitationID) // Remove the distributor from the invitations array
        });

        // Delete the invitation document
        const invitationRef = doc(db, 'Invitations', invitationID);
        await deleteDoc(invitationRef);

        return true;
    } catch (error) {
        console.error('Error declining invitation:', error);
        throw error;
    }
};

export const CheckForExistingInvitation = async (distributorID, storeID) => {
    const invitationsRef = collection(db, 'Invitations');
    const q = query(invitationsRef, where("distributorID", "==", distributorID), where("storeID", "==", storeID));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.length > 0;
};



export const FetchAllDistributorsForStore = async (storeID) => {
    try {
        var distributorsConnected = '';
        const storeRef = doc(db, 'Retail Stores', storeID);
        const storeSnap = await getDoc(storeRef);

        if (storeSnap.exists()) {
            distributorsConnected = storeSnap.data().distributorsConnected;

            if (distributorsConnected.length > 0) {
                const array = await FetchDistributorsInfo(distributorsConnected)
                return array;
            }
        }
    } catch (error) {
        throw error; // Rethrow the error to handle it at a higher level

    }
}



export const FetchDistributorsInfo = async (distributorsList) => {
    try {
        const distributorsData = [];

        // Loop through each distributor ID and fetch its document
        for (const distributorId of distributorsList) {
            const distributorRef = doc(db, 'Distribution Stores', distributorId);
            const distributorSnapshot = await getDoc(distributorRef);

            if (distributorSnapshot.exists()) {
                const distributorData = distributorSnapshot.data();
                const subcollectionRef = collection(distributorRef, "products");
                const subcollectionSnapshot = await getDocs(subcollectionRef);

                const subcollectionData = subcollectionSnapshot.docs.map(doc => ({
                    id: doc.id,
                    data: doc.data()
                }));

                distributorData.productsData = subcollectionData;

                distributorsData.push({
                    id: distributorSnapshot.id,
                    data: distributorData
                });
            } else {
                console.log(`Document with ID ${distributorId} does not exist.`);
            }
        }

        return distributorsData;
    } catch (error) {
        console.error('Error fetching distributors information:', error);
        throw error; // Rethrow the error to handle it at a higher level
    }
};

export const fetchOrderHistoryForDistributor = async (distributorID) => {
    try {
        console.log("Fetching order history for distributor:", distributorID);
        const ordersQuery = query(collection(db, 'Orders'), where('distributorID', '==', distributorID));
        const ordersSnapshot = await getDocs(ordersQuery);

        const ordersData = [];
        for (const orderDoc of ordersSnapshot.docs) {
            const orderData = orderDoc.data();
            console.log("Order data:", orderData);
            
            const orderItemsSnapshot = await getDocs(collection(orderDoc.ref, 'orderItems'));
            const orderItemsData = orderItemsSnapshot.docs.map((doc) => doc.data());
            console.log("Order items data:", orderItemsData);
            
            orderData.orderItems = orderItemsData;

            // Fetch store name using store ID
            const storeDocRef = await doc(collection(db, 'Retail Stores'), orderData.storeID);
            const storeSnapshot = await getDoc(storeDocRef);

            if (storeSnapshot.exists()) {
                orderData.storeName = storeSnapshot.data().storeName;
            } else {
                orderData.storeName = "Unknown Store"; // Placeholder if store not found
            }

            ordersData.push({ id: orderDoc.id, ...orderData });
        }

        console.log("Order history fetched successfully:", ordersData);
        return ordersData;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error; // Rethrow the error to handle it at a higher level
    }
};

export const CreateNewOrderForStore = async (storeID, distributorID, orderItems) => {
    try {
        const updateMap = new Map(); // Map to store docRef and newUnitsInStock

        await runTransaction(db, async (transaction) => {
            const distributorRef = doc(db, 'Distribution Stores', distributorID);
            const productsInfoRef = collection(distributorRef, "products");
            var totalCost = 0;

            for (const item of orderItems) {
                const docRef = doc(productsInfoRef, item.productData.id);
                const productSnapshot = await transaction.get(docRef);
                const productData = productSnapshot.data();
                if (!(productData.unitsInStock >= item.unitsOrdered)) {
                    throw new Error('Error Creating Order: Few Items are out of Stocks!!');
                }

                const productCost = (item.productData?.data?.unitPrice * item.unitsOrdered).toFixed(2);
                item.productCost = parseFloat(productCost); // Convert back to a float
                totalCost += item.productCost;

                // Store docRef and newUnitsInStock in the map
                updateMap.set(docRef, productData.unitsInStock - item.unitsOrdered);
            }

            // Set up the initial data for the order
            const orderData = {
                createdAt: new Date(),
                distributorID: distributorID,
                storeID: storeID,
                currentStatus: "Pending",
                totalCost: totalCost
            };

            // Add the order to the "Orders" collection
            const orderRef = doc(collection(db, 'Orders'));
            transaction.set(orderRef, orderData);

            // Add orderItems to the subcollection "orderItems"
            for (const item of orderItems) {
                const itemRef = doc(collection(db, 'Orders', orderRef.id, "orderItems")); // Construct a new DocumentReference for orderItems
                transaction.set(itemRef, item);
            }

            // Update unitsInStock after all readings are done
            updateMap.forEach((newUnitsInStock, docRef) => {
                transaction.update(docRef, { unitsInStock: newUnitsInStock });
            });

            return orderRef.id; // Return the ID of the created order
        });
    } catch (error) {
        throw error; // Throw error for handling in UI or higher-level components
    }
};

export const updateOrderStatus = async (orderId, newStatus) => {
    try {
        const orderRef = doc(db, 'Orders', orderId);
        await updateDoc(orderRef, {
            currentStatus: newStatus
        });
        console.log(`Order status updated successfully: ${orderId} -> ${newStatus}`);
        return; // Return nothing if the update is successful
    } catch (error) {
        console.error('Error updating order status:', error);
        throw error; // Throw error for handling in UI or higher-level components
    }
};

export const fetchOrderHistoryForStore = async (storeID) => {
    try {
        const ordersQuery = query(collection(db, 'Orders'), where('storeID', '==', storeID));
        const ordersSnapshot = await getDocs(ordersQuery);

        const ordersData = [];
        for (const orderDoc of ordersSnapshot.docs) {
            const orderData = orderDoc.data();
            const orderItemsSnapshot = await getDocs(collection(orderDoc.ref, 'orderItems'));
            const orderItemsData = orderItemsSnapshot.docs.map((doc) => doc.data());
            orderData.orderItems = orderItemsData;

            // Fetch distributor name using distributor ID
            const distributorDocRef = await doc(collection(db, 'Distribution Stores'), orderData.distributorID);
            const distributorSnapshot = await getDoc(distributorDocRef);

            if (distributorSnapshot.exists()) {
                orderData.distributorName = distributorSnapshot.data().storeName;
            } else {
                orderData.distributorName = "Unknown Distributor"; // Placeholder if distributor not found
            }

            ordersData.push({ id: orderDoc.id, ...orderData });

        }

        return ordersData;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error; // Rethrow the error to handle it at a higher level

    }
};

export const FetchUserData = async (uuid) => {
    const userDataRef = doc(db, 'Users', uuid);
    const userDataSnapshot = await getDoc(userDataRef);
    const userData = userDataSnapshot.data();

    return userData;
}

// This function fetches detailed information for a list of store IDs.
export const FetchStoresDetailsByIDs = async (storeIDs) => {
    try {
      const storesData = await Promise.all(storeIDs.map(async (storeID) => {
        const storeRef = doc(db, 'Retail Stores', storeID);

        const storeSnap = await getDoc(storeRef);
        if (!storeSnap.exists()) {
          console.error(`No data found for store with ID: ${storeID}`);
          return null; // This will ensure that non-existing stores do not cause errors.
        }
        return { id: storeID, ...storeSnap.data() };
      }));
  
      // Filter out any potential null values if some stores were not found.
      return storesData.filter(store => store !== null);
    } catch (error) {
      console.error('Error fetching stores details:', error);
      throw new Error('Error fetching stores details');
    }
  };

  export const FetchStoreDetails = async (storeId) => {
    try {
        const storeRef = doc(db, 'Retail Stores', storeId);
        const storeSnap = await getDoc(storeRef);

        if (storeSnap.exists()) {
            return { id: storeSnap.id, ...storeSnap.data() };
        } else {
            throw new Error('Distribution store details not found.');
        }
    } catch (error) {
        console.error('Error fetching distribution store details:', error);
    }
}


// fetching store name by store id.
export const FetchStoreDataByID = async (uuid) => {
    const userDataRef = doc(db, 'Retail Stores', uuid);
    const userDataSnapshot = await getDoc(userDataRef);
    const userData = userDataSnapshot.data();
    return userData.storeName;
}

// fetching store name by store id.
export const FetchDistributorDataByID = async (uuid) => {
    const userDataRef = doc(db, 'Distribution Stores', uuid);
    const userDataSnapshot = await getDoc(userDataRef);
    const userData = userDataSnapshot.data();
    return userData.storeName;
}

export const FetchStoreInventory = async (storeID) => {
    try {
        var storeData = {};

        // Loop through each distributor ID and fetch its document
        const storeRef = doc(db, 'Retail Stores', storeID);
        const storeSnapshot = await getDoc(storeRef);

        if (storeSnapshot.exists()) {
            storeData = storeSnapshot.data();
            const subcollectionRef = collection(storeRef, "Inventory");
            const subcollectionSnapshot = await getDocs(subcollectionRef);

            const subcollectionData = subcollectionSnapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data()
            }));

            storeData.inventory = subcollectionData;
        } else {
            console.log(`Document with ID ${storeID} does not exist.`);
        }

        return storeData.inventory;
    } catch (error) {
        console.error('Error fetching store information:', error);
        throw error; // Rethrow the error to handle it at a higher level
    }

}

export const DisconnectDistributorStore = async (storeID, distributorID) => {
    try {
        const distributorRef = doc(db, 'Distribution Stores', distributorID);
        await updateDoc(distributorRef, {
            storesConnected: arrayRemove(storeID) // Add the store to the storesConnected array
        });

        const storeRef = doc(db, 'Retail Stores', storeID);
        await updateDoc(storeRef, {
            distributorsConnected: arrayRemove(distributorID) // Add the distributor to the distributorsConnected array
        });
    } catch (error) {
        throw error
    }
}