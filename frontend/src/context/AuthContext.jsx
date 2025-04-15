import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { Children, createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase.config";

const AuthContext = createContext();
export const useAuth = () => {
    return useContext(AuthContext)
}

const googleProvider = new GoogleAuthProvider();

// authProvider

export const AuthProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // register a user
    const registerUser = async (email, password) => {
        return await createUserWithEmailAndPassword(auth, email, password);
    }

    // login the user
    const loginUser = async(email, password) => {
        return await signInWithEmailAndPassword(auth, email, password);
    }

    // sign in with google
    const signInWithGoogle = async() => {
        return await signInWithPopup(auth, googleProvider)
    }

    // logout the user
    const logoutUser = () => {
        return signOut(auth)
    }

    // manage user
    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);

            if(user){
                const {email, displayName, photoUrl} = user;
                const userData = {
                    email, username: displayName, photo:photoUrl
                }
            }
        })
        return () => unSubscribe();
    },[])

    const value = {
        currentUser, 
        loading,
        registerUser,
        loginUser,
        signInWithGoogle,
        logoutUser
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>

    )
}