 import { useCallback, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import PageButton from './Components/PageButton';
import Addition from './Components/Addition';
import Interest from './Components/Interest';

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
        {page == 0 && <Addition/>}
        {page == 1 && <Interest/>}
      </header>
    </div>
  );
}

export default App;
