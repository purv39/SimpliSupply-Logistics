import { storage } from "./firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export const AddTaxFileToStorage = async (taxFile, storeID) => {
    const storageRef = ref(storage, `files/${storeID}_taxFile`);;
    const uploadTask = uploadBytesResumable(storageRef, taxFile);
    
    uploadTask.on("state_changed",
      (snapshot) => {
        
      },
      (error) => {
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log(downloadURL)
            return downloadURL;
        });
      }
    );
};
