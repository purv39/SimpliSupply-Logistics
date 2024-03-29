import React from "react";
import { useAuth } from "../firebase/firebaseAuth";
import PageNotFound from "../pages/PageNotFound";

const StoreOperatorPrivateRoute = ({ children }) => {
    const { currentUser } = useAuth();
    if (currentUser && currentUser.currentRole === 'Store') {
        return children;
    }
    
    return <PageNotFound />
};

export default StoreOperatorPrivateRoute;
