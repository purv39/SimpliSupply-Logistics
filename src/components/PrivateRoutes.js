import React from "react";
import { useAuth } from "../firebase/firebaseAuth";
import PageNotFound from "../pages/PageNotFound";

const PrivateRoutes = ({ children }) => {
    const { currentUser } = useAuth();

    if (currentUser) {
        return children ;
    }
    return <PageNotFound />

};

export default PrivateRoutes;
