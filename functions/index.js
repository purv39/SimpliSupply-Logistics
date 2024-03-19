const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const { firestore } = admin;

exports.createProductFunction = functions.firestore
    .document("Distribution Stores/{distributorID}/products/{newProductID}")
    .onCreate(async (snapshot, context) => {
        const newData = snapshot.data();
        const { distributorID, newProductID } = context.params;

        try {
            // Retrieve distributor document data
            const distributorDoc = await firestore().collection("Distribution Stores").doc(distributorID).get();
            const distributorData = distributorDoc.data();

            // Add distributorID and distributorStoreName to newData
            newData.distributorID = distributorID;
            newData.distributorStoreName = distributorData.storeName; // Assuming store name field is 'storeName'

            const productsCollection = firestore().collection("Products");
            const productDocRef = productsCollection.doc(`${distributorID}-${newProductID}`);

            await productDocRef.set(newData);
            console.log(`New product document created with ID: ${distributorID}-${newProductID}`);
        } catch (error) {
            console.error("Error creating product document:", error);
        }
    });

exports.updateProductFunction = functions.firestore
    .document("Distribution Stores/{distributorID}/products/{productID}")
    .onUpdate(async (change, context) => {
        const updatedData = change.after.data();
        const { distributorID, productID } = context.params;

        try {
            const productsCollection = firestore().collection("Products");
            const productDocRef = productsCollection.doc(`${distributorID}-${productID}`);

            await productDocRef.update(updatedData);
            console.log(`Product document updated with ID: ${distributorID}-${productID}`);
        } catch (error) {
            console.error("Error updating product document:", error);
        }
    });

exports.deleteProductFunction = functions.firestore
    .document("Distribution Stores/{distributorID}/products/{productID}")
    .onDelete(async (snapshot, context) => {
        const { distributorID, productID } = context.params;

        try {
            const productsCollection = firestore().collection("Products");
            const productDocRef = productsCollection.doc(`${distributorID}-${productID}`);

            await productDocRef.delete();
            console.log(`Product document deleted with ID: ${distributorID}-${productID}`);
        } catch (error) {
            console.error("Error deleting product document:", error);
        }
    });
