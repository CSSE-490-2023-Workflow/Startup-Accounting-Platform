import React, {useState, useEffect, useCallback} from 'react';
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import {Button} from "@mantine/core";
import {Avatar, Group, Menu, rem, Text, UnstyledButton} from "@mantine/core";
import cx from "clsx";
import classes from "../HeaderTabs.module.css";
import {
    IconChevronDown,
    IconLogout,
    IconSettings,
} from "@tabler/icons-react";

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
    const [userMenuOpened, setUserMenuOpened] = useState(false);

    const handleLogout = useCallback(() => {
        auth.signOut().then(() => {
            setUser(null);
        })
    }, []);


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
            <Menu
                width={260}
                position="bottom-end"
                transitionProps={{ transition: 'pop-top-right' }}
                onClose={() => setUserMenuOpened(false)}
                onOpen={() => setUserMenuOpened(true)}
                withinPortal
            >
                <Menu.Target>
                    <UnstyledButton
                        className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
                    >
                        <Group gap={7}>
                            <Avatar src={user.photoURL} alt={user.displayName || ""} radius="xl" size={20} />
                            <Text fw={500} size="sm" lh={1} mr={3}>
                                {user.displayName}
                            </Text>
                            <IconChevronDown style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
                        </Group>
                    </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Label>Settings</Menu.Label>
                    <Menu.Item
                        leftSection={
                            <IconSettings style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                        }
                    >
                        Account settings
                    </Menu.Item>
                    <Menu.Item
                        leftSection={
                            <IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                        }
                        onClick={handleLogout}
                    >
                        Logout
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
        )
    }

    return (
        <Button onClick={signInWithGoogle}>
            Sign in with Google
        </Button>
    );
}

export default LoginButton;
