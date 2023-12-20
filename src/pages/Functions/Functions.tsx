import { useCallback, useState } from 'react';
import './Functions.css'
import PageButton from '../../Components/PageButton';
import FuncBuilderMain from '../../Components/FunctionBuilder/FuncBuilderMain';

function Functions() {
    const [page, setPage] = useState(0)
    const handlePageChange = useCallback((val: number) => {
      setPage(val)
    }, [])
    return (
      <div className="Demo">
        <header className="App-header">
          <PageButton onClick={handlePageChange} value={1} name="Function Builder" />
          {page == 1 && <FuncBuilderMain/>}
        </header>
      </div>
    );
  }

  export default Functions;