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

export const  AddImageToStorage = async (taxFile) => {
    const storageRef = ref(storage, `product_image/image`);;
    const uploadTask = uploadBytesResumable(storageRef, taxFile);

    await uploadTask;

    const dwnldurl = await getDownloadURL(uploadTask.snapshot.ref);

    const downloadURL = dwnldurl.split("?")[0];

    return downloadURL;
};