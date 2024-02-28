import React from "react";
import { Navigate } from "react-router";
import { useAuth } from "../firebase/firebaseAuth";
import PageNotFound from "../pages/PageNotFound";

const DistributorPrivateRoute = ({ children }) => {
    const { currentUser } = useAuth();

    if (currentUser && currentUser.currentRole === 'Distributor') {
        return children;
    }

    return <PageNotFound />


};

export default DistributorPrivateRoute;
