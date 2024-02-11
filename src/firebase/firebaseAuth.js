import { createContext, useContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword,
         signInWithEmailAndPassword,
         signOut,
         onAuthStateChanged 
} from "firebase/auth";
import { auth } from "./firebaseConfig";

const UserContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState({});

    const SignUp = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                return userCredential.user.uid; // Return UUID
            });
    }
    

    const Login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    }

    const LogOut = () => {
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
        Login,
        LogOut,
        SignUp
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