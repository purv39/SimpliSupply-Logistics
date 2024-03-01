import React, { createContext, useContext, useState, useEffect } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "./firebaseConfig";
import { FetchUserData } from "./firebaseFirestore";

const UserContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(() => {
        const savedUser = sessionStorage.getItem('currentUser');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    useEffect(() => {
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    }, [currentUser]);

    const SignUp = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                return userCredential;
            });
    }

    const SetCurrentUserDetails = (userCredential, selectedRole) => {
        return FetchUserData(userCredential.user.uid).then((userData) => {
            if (userData.roles.storeOperator && selectedRole === 'Store') {
                userCredential.selectedStore = userData.storesList[0];
                userCredential.storesList = userData.storesList;
                userCredential.currentRole = selectedRole;
                setCurrentUser(userCredential);
            } else if (userData.roles.distributor && selectedRole === 'Distributor') {
                userCredential.selectedStore = userData.distributionStores[0];
                userCredential.storesList = userData.distributionStores;
                userCredential.currentRole = selectedRole;
                setCurrentUser(userCredential);
            } else {
                throw new Error("Invalid role for this user.");
            }
        })
    }
    const Login = (email, password, role) => {
        return signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                if (userCredential.user) {
                    return SetCurrentUserDetails(userCredential, role);
                }
            });
    }

    const LogOut = () => {
        sessionStorage.removeItem('currentUser');
        return signOut(auth);
    }

    const Forgot = (email) => {
        return sendPasswordResetEmail(auth, email);
    }


    const value = {
        currentUser,
        Login,
        LogOut,
        SignUp,
        Forgot,
        SetCurrentUserDetails
    }

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(UserContext);
}