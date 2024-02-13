import { storage } from "./firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export const AddTaxFileToStorage = async (taxFile, storeID) => {
    const storageRef = ref(storage, `files/${storeID}_taxFile`);;
    const uploadTask = uploadBytesResumable(storageRef, taxFile);

    await uploadTask;

    const dwnldurl = await getDownloadURL(uploadTask.snapshot.ref);

    return dwnldurl;
};
