import React, { useCallback, useState } from 'react';
import NumberInput from './NumberInput';
import { func_interpreter, func_2} from '../engine/engine'

function Addition() {
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
    <>
        <label>
          First number: <NumberInput handleStateChange={handleChange} ind={0} inValue={0}/>
        </label>
        <label>
          Second number: <NumberInput handleStateChange={handleChange} ind={1} inValue={0}/>
        </label>
        <button onClick={handleAdd}>Add</button>
        <p>Sum: {result}</p>
    </>
  );
}

export default Addition;
