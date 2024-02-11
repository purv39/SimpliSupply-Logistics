import { db } from "./firebaseConfig";
import { collection, doc, setDoc } from 'firebase/firestore';



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
        zipCode: zipCode,
        province: province,
        role: roleObject,
        storeList: [],
        distributionStores: []
    });
}