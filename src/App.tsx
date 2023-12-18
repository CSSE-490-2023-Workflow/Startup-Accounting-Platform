import {
    Route, Routes, BrowserRouter
} from 'react-router-dom'
import {Home} from "./Home";
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