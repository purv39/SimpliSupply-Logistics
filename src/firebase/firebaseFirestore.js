import { db } from "./firebaseConfig";
import { collection, doc, setDoc, addDoc, updateDoc, arrayUnion } from 'firebase/firestore';
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
