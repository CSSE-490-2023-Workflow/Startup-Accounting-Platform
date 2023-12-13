import { useCallback, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import PageButton from './Components/PageButton';
import Addition from './Components/Addition';
import Interest from './Components/Interest';
import Calculator from './Components/Calculator';
import CashFlow from './Components/CashFlow';
import LoginButton from "./Auth/firebase";
import FuncBuilderMain from './Components/FunctionBuilder/FuncBuilderMain';

function App() {
  const [page, setPage] = useState(0)
  const handlePageChange = useCallback((val: number) => {
    setPage(val)
  }, [])
  return (
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
        <LoginButton/>
      </header>
    </div>
  );
}

export default App;
