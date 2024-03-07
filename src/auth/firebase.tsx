import React, {useCallback, useContext, useEffect, useState} from 'react';
import {initializeApp} from "firebase/app";
import {getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup} from "firebase/auth";
import {Avatar, Box, Button, ButtonProps, Group, LoadingOverlay, Menu, rem, Text, UnstyledButton} from "@mantine/core";
import cx from "clsx";
import classes from "../Components/HomeHeader/HeaderTabs.module.css";
import {IconChevronDown, IconLogout, IconSettings,} from "@tabler/icons-react";
import {useNavigate} from "react-router-dom";
import {GoogleIcon} from "./GoogleIcon";
import {getFirestore} from 'firebase/firestore';
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import {FirestoreRepository} from "./FirebaseRepository";

const firebaseConfig = {
    apiKey: "AIzaSyAZ24dgD9s7XyQa0jPFHYvkxJKksiruOOs",
    authDomain: "startupaccountingplatform.firebaseapp.com",
    projectId: "startupaccountingplatform",
    storageBucket: "startupaccountingplatform.appspot.com",
    messagingSenderId: "697027847301",
    appId: "1:697027847301:web:6af199f2d54c3a8d2235ec",
    measurementId: "G-7L7QJ0XC2W"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore();

// @ts-ignore
export const database = new FirestoreRepository(db);

export const LoginButton = (props: ButtonProps & React.ComponentPropsWithoutRef<'button'>) => {
    const { currentUser, setCurrentUser } = useContext(AuthContext);

    const navigate = useNavigate();

    const signInWithGoogle = () => {
        signInWithPopup(auth, provider).then((result) => {
            setCurrentUser(result.user);
        }).catch(() => {
            alert("Failed to log in");
        });
    }

    if(currentUser) {
        navigate('/');
    }

    return <Button leftSection={<GoogleIcon />} variant="default" onClick={signInWithGoogle} {...props} />;

}

export const UserMenu = () => {
    const {currentUser, setCurrentUser} = useContext(AuthContext)
    const [userMenuOpened, setUserMenuOpened] = useState(false);

    const handleLogout = useCallback(() => {
        auth.signOut().then(() => {
            setCurrentUser(null);
        })
    }, []);

    return (
        <Menu
            width={260}
            position="bottom-end"
            transitionProps={{transition: 'pop-top-right'}}
            onClose={() => setUserMenuOpened(false)}
            onOpen={() => setUserMenuOpened(true)}
            withinPortal
        >
            <Menu.Target>
                <UnstyledButton
                    className={cx(classes.user, {[classes.userActive]: userMenuOpened})}
                >
                    <Group gap={7}>
                        <Avatar src={currentUser ? currentUser.photoURL : ""} alt={currentUser?.displayName ? currentUser.displayName : "Error"} radius="xl" size={20}/>
                        <Text fw={500} size="sm" lh={1} mr={3}>
                            {currentUser?.displayName ? currentUser.displayName : "Error"}
                        </Text>
                        <IconChevronDown style={{width: rem(12), height: rem(12)}} stroke={1.5}/>
                    </Group>
                </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Label>Settings</Menu.Label>
                <Menu.Item
                    leftSection={
                        <IconSettings style={{width: rem(16), height: rem(16)}} stroke={1.5}/>
                    }
                >
                    Account settings
                </Menu.Item>
                <Menu.Item
                    leftSection={
                        <IconLogout style={{width: rem(16), height: rem(16)}} stroke={1.5}/>
                    }
                    onClick={handleLogout}
                >
                    Logout
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    )
}

export const AuthContext = React.createContext({currentUser: auth.currentUser, setCurrentUser: (user: any) => {}});

// @ts-ignore
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(auth.currentUser);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if(user?.uid) {
                database.createUserIfNotExists(user.uid, user?.email, user?.photoURL, user?.displayName);
            }
            setCurrentUser(user);
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <Box>
                <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
            </Box>
        );
    }

    return (
        <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
            {children}
        </AuthContext.Provider>
    );
};
