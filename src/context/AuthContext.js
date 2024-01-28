import { createContext, useContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword,
         signInWithEmailAndPassword,
         signOut,
         onAuthStateChanged 
} from "firebase/auth";
import { auth } from "../config/firebaseConfig";

const UserContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState({});

    const signUp = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    }

    const logOut = () => {
        return signOut(auth);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setCurrentUser(currentUser);
        
        })
        return () => {
            unsubscribe()
        }
    }, [])

    const value = {
        currentUser,
        login,
        logOut,
        signUp
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