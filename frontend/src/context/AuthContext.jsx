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
    const logoutUser = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem("user");      // from onAuthStateChanged
            localStorage.removeItem("userData");  // your MongoDB user info
        } catch (error) {
            console.error("Error logging out:", error);
        }
    }


    // manage user
    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);

            if(user){
                // Store user data in localStorage
                localStorage.setItem('user', JSON.stringify({
                    _id: user.uid,  // Using Firebase UID as _id
                    email: user.email,
                    username: user.displayName,
                    photo: user.photoURL
                }));
            } else {
                localStorage.removeItem('user');
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