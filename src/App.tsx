import React, { ChangeEvent, useCallback, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import NumberInput from './Components/NumberInput';
import { func_interpreter, func_2} from './engine/engine'

function App() {
  const [inputs, setInputs] = useState([0,0])
  const [result, setResult] = useState(0)
  const handleAdd = useCallback(() => {
    setResult(Number(func_interpreter(func_2, ...inputs)[0]))
  }, [])
  const handleChange = useCallback((ind: number, value: number) => {
    inputs[ind] = value
    setInputs(inputs)
  }, [])
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
          Startup Accounting Platform
        <label>
          First number: <NumberInput handleStateChange={handleChange} ind={0} inValue={0}/>
        </label>
        <label>
          Second number: <NumberInput handleStateChange={handleChange} ind={1} inValue={0}/>
        </label>
        <button onClick={handleAdd}>Add</button>
        <p>Sum: {result}</p>
      </header>
    </div>
  );
}

export default App;
