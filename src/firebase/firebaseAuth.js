import { createContext, useContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword,
         signInWithEmailAndPassword,
         signOut,
         onAuthStateChanged,
         sendPasswordResetEmail
         
} from "firebase/auth";
import { auth } from "./firebaseConfig";

const UserContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState({});

    const SignUp = (user) => {
        return createUserWithEmailAndPassword(auth, user.email, user.password);

    }

    const Login = (user) => {
        return signInWithEmailAndPassword(auth, user.email, user.password);
    }

    const LogOut = () => {
        return signOut(auth);
    }
    const forget = (email) => {
        return sendPasswordResetEmail(auth,email);
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