import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import "../styles/PageNotFound.css";
import { useAuth } from '../firebase/firebaseAuth';

const PageNotFound = () => {
    const { currentUser } = useAuth();

    return (
        <div id="notfound">
            <div className="notfound">
                <div className="notfound-404">
                    <h1>Oops!</h1>
                    <h2>404 - The Page can't be found</h2>
                </div>
                {/* Conditional rendering of the "Go Back" link */}
                {currentUser ? (
                    currentUser.currentRole === 'Store' ? (
                        <Link to="/StoreHome">Go Home</Link> 
                    ) : (
                        <Link to="/DistributorHome">Go Home</Link> 

                    )
                    
                ) : (
                    <Link to="/Login">Go Back</Link> 
                )}
            </div>
        </div>
    );
};

export default PageNotFound;
