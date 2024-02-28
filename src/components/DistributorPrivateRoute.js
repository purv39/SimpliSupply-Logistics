import React from "react";
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
