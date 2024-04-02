import { storage } from "./firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export const AddTaxFileToStorage = async (taxFile, storeID) => {
    const storageRef = ref(storage, `files/${storeID}_taxFile`);;
    const uploadTask = uploadBytesResumable(storageRef, taxFile);

    await uploadTask;

    const dwnldurl = await getDownloadURL(uploadTask.snapshot.ref);

    const downloadURL = dwnldurl.split("?")[0];

    return downloadURL;
};

export const  AddImageToStorage = async (storeID, productID, image) => {
    const storageRef = ref(storage, `product_image/${storeID}_${productID}_product`);;
    const uploadTask = uploadBytesResumable(storageRef, image);

    await uploadTask;

    const dwnldurl = await getDownloadURL(uploadTask.snapshot.ref);

    const downloadURL = dwnldurl.split("?")[0] + '?alt=media';
    
    return downloadURL;
};