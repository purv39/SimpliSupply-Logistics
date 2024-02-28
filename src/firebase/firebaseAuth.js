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
                return userCredential.user.uid;
            });
    }

    const Login = (email, password, role) => {
        return signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                if (userCredential.user) {
                    return FetchUserData(userCredential.user.uid)
                        .then((roles) => {
                            if ((roles.storeOperator && role === 'Store') || (roles.distributor && role === 'Distributor')) {
                                userCredential.currentRole = role;
                                setCurrentUser(userCredential);
                            } else {
                                throw new Error("Invalid role for this user.");
                            }
                        });
                }
            });
    }

    const LogOut = () => {
        sessionStorage.removeItem('currentUser');
        return signOut(auth);
    }

    const forget = (email) => {
        return sendPasswordResetEmail(auth, email);
    }


    const value = {
        currentUser,
        Login,
        LogOut,
        SignUp,
        forget
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