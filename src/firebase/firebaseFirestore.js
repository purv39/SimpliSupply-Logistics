import { db } from "./firebaseConfig";
import { collection, doc, setDoc, addDoc, updateDoc, arrayUnion, getDocs, getDoc, query, where, runTransaction } from 'firebase/firestore';
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
export const AddProductToInventory = async (distributorID, productName, category, quantityPerUnit, unitPrice, unitsInStock) => {
    try {
        // Construct the product object
        const productData = {
            productName: productName,
            category: category,
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

export const CreateNewOrderForStore = async (storeID, distributorID, orderItems) => {
    try {
        await runTransaction(db, async (transaction) => {
            const distributorRef = doc(db, 'Distribution Stores', distributorID);
            const productsInfoRef = collection(distributorRef, "products");
            var totalCost = 0;

            for (const item of orderItems) {
                const docRef = doc(productsInfoRef, item.productData.id);
                const productSnapshot = await transaction.get(docRef);
                const productData = productSnapshot.data();
                
                if (!(productData.unitsInStock >= item.unitsOrdered)) {
                    throw new Error('Error Creating Order: Few Items are out of Stock!!');
                }

                const productCost = (item.productData?.data?.unitPrice * item.unitsOrdered).toFixed(2);
                item.productCost = parseFloat(productCost); // Convert back to a float
                totalCost += item.productCost;
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

            return orderRef.id; // Return the ID of the created order
        });
    } catch (error) {
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