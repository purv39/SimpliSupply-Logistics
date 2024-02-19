// components/WelcomePage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../firebase/firebaseAuth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from "../firebase/firebaseConfig"; // Firestore 설정을 가져옵니다.
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap
import "../styles/Welcome.css";

const WelcomePage = () => {
  const { currentUser } = useAuth();
  const [userInfo, setUserInfo] = useState({
    address: '',
    contactNumber: '',
    storeName: '', 
    storeNumber: '', 
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser && currentUser.uid) {
        const userRef = doc(db, 'Users', currentUser.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          const fullName = `${userData.firstName} ${userData.lastName}`; 
          const firstStoreId = userData.storesList.length > 0 ? userData.storesList[0] : null;
          let storeName = '';
          let storeNumber = '';
          let storeAddress = '';

          if (firstStoreId) {
            const storeRef = doc(db, 'Retail Stores', firstStoreId);
            const storeSnap = await getDoc(storeRef);
            if (storeSnap.exists()) {
              storeName = storeSnap.data().storeName;
              storeNumber = storeSnap.data().businessNumber; 
              storeAddress = storeSnap.data().storeAddress;
            }
          }

          setUserInfo({
            fullName,
            address: `${userData.address}, ${userData.city}, ${userData.province}, ${userData.postalCode}`,
            contactNumber: userData.contactNumber,
            storeName,
            storeNumber,
            storeAddress
          });
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  return (
    <div>
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4 text-center">Information</h1>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="card">
            <div className="card-body bg-light">
              <table className="table">
                <tbody>
                  <tr>
                    <th scope="row">Name</th>
                    <td>{userInfo.fullName}</td>
                  </tr>
                  <tr>
                    <th scope="row">Email</th>
                    <td>{currentUser.email}</td>
                  </tr>
                  <tr>
                    <th scope="row">Address</th>
                    <td>{userInfo.address}</td>
                  </tr>
                  <tr>
                    <th scope="row">Phone</th>
                    <td>{userInfo.contactNumber}</td>
                  </tr>
                  <tr>
                    <th scope="row">Store Name</th>
                    <td>{userInfo.storeName}</td>
                  </tr>
                  <tr>
                    <th scope="row">Store Number</th>
                    <td>{userInfo.storeNumber}</td>
                  </tr>
                  <tr>
                    <th scope="row">Store Address</th>
                    <td>{userInfo.storeAddress}</td>
                  </tr>
                </tbody>
              </table>
              <div className="text-right">
                <button className="btn custom-btn-primary">Edit</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
