import { createContext, useContext, useEffect, useState } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail
} from "firebase/auth";
import { auth } from "./firebaseConfig";
import { FetchUserData } from "./firebaseFirestore";

const UserContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [currentRole, setCurrentRole] = useState('');

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
                                setCurrentRole(role);
                                userCredential.user.currentRole = role;
                                setCurrentUser(userCredential.user);
                            } else {
                                throw new Error("Invalid role for this user.");
                            }
                        });
                }
            });
    }

    const LogOut = () => {
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