import React from "react";
import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const PrivateRoutes = ({children}) => {
    const {currentUser} = useAuth();

    if(!currentUser) {
        return <Navigate to='/' />
    }

    return children;


};

export default PrivateRoutes;
