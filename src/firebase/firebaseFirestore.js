import { db } from "./firebaseConfig";
import { collection, doc, setDoc, addDoc, updateDoc, arrayUnion, getDocs, getDoc, writeBatch } from 'firebase/firestore';
import { AddTaxFileToStorage } from "./firebaseStorage";


export const AddNewUserToFirestore = (uuid, email, firstName, lastName, contactNumber, address, city, zipCode, province, role) => {
    let storeOperator = false;
    let distributor = false;
    if (role === 'store') {
        storeOperator = true;
    } else if (role === 'distributor') {
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
            distributorOrders: []
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
            storeOrdersList: []
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
        // Set up the initial data for the order
        const orderData = {
            createdAt: new Date(),
            distributorID: distributorID,
            storeID: storeID,
            fulfillmentStatus: {
                delivered: false,
                paymentReceived: false,
                shipped: false
            }
        };

        // Add the order to the "Orders" collection
        const orderRef = await addDoc(collection(db, 'Orders'), orderData);

        // Add orderItems to the subcollection "orderItems"
        const batch = writeBatch(db);
        orderItems.forEach(async (item) => {
            const itemRef = doc(collection(orderRef, "orderItems")); // Construct a new DocumentReference for orderItems
            batch.set(itemRef, item);
        });
        await batch.commit();

        console.log("Order successfully created:", orderRef.id);
        return orderRef.id; // Return the ID of the created order
    } catch (error) {
        console.error("Error creating order:", error);
        throw error; // Throw error for handling in UI or higher-level components
    }
};
