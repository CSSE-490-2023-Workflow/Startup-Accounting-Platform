import { useCallback, useState } from 'react';
import logo from './logo.svg';
import '@mantine/core/styles.css';
import { createTheme, MantineProvider } from '@mantine/core';
import {Home} from "./Home";
import {LoginPage} from "./pages/LoginPage/LoginPage";
import PrivateRoute from "./PrivateRoute";
import {
  Route, Routes, BrowserRouter
} from 'react-router-dom'

const theme = createTheme({
  /** Put your mantine theme override here */
});

function App() {
  const [page, setPage] = useState(0)
  const handlePageChange = useCallback((val: number) => {
    setPage(val)
  }, [])
  return (
    <div>
    <BrowserRouter>
            <Routes>
                <Route path='/' element={<PrivateRoute/>}>
                    <Route path='/' element={<Home/>}/>
                </Route>
                <Route path="/login" element={<LoginPage/>} />
            </Routes>
        </BrowserRouter>
    </div>
    
  );
}


export default App