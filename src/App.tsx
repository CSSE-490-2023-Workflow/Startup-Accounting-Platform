import { useCallback, useState } from 'react';
import logo from './logo.svg';
import '@mantine/core/styles.css';
import { createTheme, MantineProvider } from '@mantine/core';
import PageButton from './Components/PageButton';
import Addition from './Components/Addition';
import Interest from './Components/Interest';
import Calculator from './Components/Calculator';
import CashFlow from './Components/CashFlow';
import FuncBuilderMain from './Components/FunctionBuilder/FuncBuilderMain';
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
    {/* <MantineProvider theme={theme}>
      <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
            Startup Accounting Platform
          <PageButton onClick={handlePageChange} value={0} name="Addition Page" />
          <PageButton onClick={handlePageChange} value={1} name="Interest Page" />
          <PageButton onClick={handlePageChange} value={2} name="Calculator Page" />
          <PageButton onClick={handlePageChange} value={3} name="Cash Flow Page" />
          <PageButton onClick={handlePageChange} value={4} name="Function Builder Page" />
          {page == 0 && <Addition/>}
          {page == 1 && <Interest/>}
          {page == 2 && <Calculator/>}
          {page == 3 && <CashFlow/>}
          {page == 4 && <FuncBuilderMain/>}
        </header>
      </div>
    </MantineProvider> */}
    </div>
    
  );
}


export default App