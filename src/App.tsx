import {
    BrowserRouter as Router,
    Route,
    Link,
    Navigate, Routes, BrowserRouter
} from 'react-router-dom'
import {Home} from "./Home";
import {AuthContext, AuthProvider, LoginButton} from "./auth/firebase";
import React, {useContext} from "react";
import {LoginPage} from "./pages/LoginPage/LoginPage";
import PrivateRoute from "./PrivateRoute";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<PrivateRoute/>}>
                    <Route path='/' element={<Home/>}/>
                </Route>
                <Route path="/login" element={<LoginPage/>} />
            </Routes>
        </BrowserRouter>
    )
}

export default App