// components/WelcomePage.js
import React from 'react';
import { useAuth } from '../firebase/firebaseAuth';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap
import "../styles/Welcome.css";

const WelcomePage = () => {
  //simplisupply
  // if we have more inform, we can add it here 
  const {currentUser} = useAuth();


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
                    <td>{currentUser.displayName}</td>
                  </tr>
                  <tr>
                    <th scope="row">Email</th>
                    <td>{currentUser.email}</td>
                  </tr>
                  <tr>
                    <th scope="row">Address</th>
                    <td>...</td>
                  </tr>
                  <tr>
                    <th scope="row">Phone</th>
                    <td>...</td>
                  </tr>
                  <tr>
                    <th scope="row">Store Name</th>
                    <td>...</td>
                  </tr>
                  <tr>
                    <th scope="row">Store Number</th>
                    <td>...</td>
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
