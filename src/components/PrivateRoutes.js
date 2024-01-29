import React from "react";
import { Navigate } from "react-router";
import { useAuth } from "../firebase/firebaseAuth";

const PrivateRoutes = ({children}) => {
    const {currentUser} = useAuth();

    if(!currentUser) {
        return <Navigate to='/' />
    }

    return children;


};

export default PrivateRoutes;
