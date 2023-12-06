import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAZ24dgD9s7XyQa0jPFHYvkxJKksiruOOs",
    authDomain: "startupaccountingplatform.firebaseapp.com",
    projectId: "startupaccountingplatform",
    storageBucket: "startupaccountingplatform.appspot.com",
    messagingSenderId: "697027847301",
    appId: "1:697027847301:web:6af199f2d54c3a8d2235ec",
    measurementId: "G-7L7QJ0XC2W"
};

const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const LoginButton = () => {
    const [user, setUser] = useState(auth.currentUser);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser: any) => {
            setUser(currentUser);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    const signInWithGoogle = () => {
        signInWithPopup(auth, provider).then((result) => {
            setUser(result.user);
        }).catch(() => {
            alert("Failed to log in");
        });
    }

    if(user) {
        return (
            <label>
                Logged in as {user.displayName}
            </label>
        )
    }

    return (
        <button onClick={signInWithGoogle}>
            Sign in with Google
        </button>
    );
}

export default LoginButton;
