import { db } from "./firebaseConfig";
import { collection, addDoc } from 'firebase/firestore';


export const AddUserToFirestore = (user) => {
    const ueserObject = user.toObject();
    return addDoc(collection(db, 'users'), ueserObject);
}
