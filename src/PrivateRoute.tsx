import React, { useContext } from 'react';
import {Navigate, Outlet} from 'react-router-dom';
import { AuthContext } from "./auth/firebase";

const useAuth = () => useContext(AuthContext);

// @ts-ignore
const PrivateRoute = () => {

    const {currentUser} = useAuth();

    return currentUser ? <Outlet /> : <Navigate to="/login" replace />;

};

export default PrivateRoute;