import { useCallback, useState } from 'react';
import './Demo.css';
import PageButton from '../../Components/PageButton';
import FuncBuilderMain from '../../Components/FunctionBuilder/FuncBuilderMain';

function Demo() {
  const [page, setPage] = useState(0)
  const handlePageChange = useCallback((val: number) => {
    setPage(val)
  }, [])
  return (
    <div className="Demo">
      <header className="App-header">
          Startup Accounting Platform Demo
          <br/>
        <PageButton onClick={handlePageChange} value={0} name="Addition Page" />
        <PageButton onClick={handlePageChange} value={1} name="Interest Page" />
        <PageButton onClick={handlePageChange} value={2} name="Calculator Page" />
        <PageButton onClick={handlePageChange} value={3} name="Cash Flow Page" />
        {/* {page == 0 && <Addition/>}
        {page == 1 && <Interest/>}
        {page == 2 && <Calculator/>}
        {page == 3 && <CashFlow/>} */}
      </header>
    </div>
  );
}

export default Demo;
