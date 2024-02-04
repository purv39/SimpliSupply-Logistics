// components/WelcomePage.js
import React from 'react';
import { useAuth } from '../firebase/firebaseAuth';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap

const WelcomePage = () => {
  //simplisupply
  // if we have more inform, we can add it here 
  const {currentUser} = useAuth();

  return (
    
    <div>
    <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: '#f2f2f2' }}>
      <div className="container">
        <a className="navbar-brand" href="#" style={{ color: '#4e73df', fontWeight: 'bold' }}>
          SimPli SUPPLY
        </a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <a className="nav-item nav-link active" href="#">Items</a>
            <a className="nav-item nav-link" href="#">Items</a>
            <a className="nav-item nav-link" href="#">Items</a>
            <a className="nav-item nav-link" href="#">Items</a>
            <a className="nav-item nav-link" href="#">Items</a>
          </div>
          <form className="form-inline ml-auto">
            <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
            <button className="btn btn-outline-primary my-2 my-sm-0" type="submit">LOGOUT</button>
          </form>
        </div>
      </div>
    </nav>

    <div className="container my-4">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4 text-center">About page</h1>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h2 className="mb-0">Information</h2>
            </div>
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
                  {/* Add more rows as needed */}
                </tbody>
              </table>
              <div className="text-right">
                <button className="btn btn-primary">Edit</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default WelcomePage;
