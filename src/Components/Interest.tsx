import React, { useCallback, useState } from 'react';
import NumberInput from './NumberInput';
import { func_interpreter, func_2} from '../engine/engine'

function Interest() {
  const [inputs, setInputs] = useState([0, 0, 0, 0, 0])
  const [result, setResult] = useState([])
  const handleInterest = useCallback(() => {
    setResult([])
  }, [])
  const handleChange = useCallback((ind: number, value: number) => {
    inputs[ind] = value
    setInputs(inputs)
  }, [])
  return (
    <>
        <label>
          Initial Amount: <NumberInput handleStateChange={handleChange} ind={0} inValue={0}/>
        </label>
        <label>
          Interest Rate: <NumberInput handleStateChange={handleChange} ind={1} inValue={0}/>
        </label>
        <label>
          Start Time: <NumberInput handleStateChange={handleChange} ind={2} inValue={0}/>
        </label>
        <label>
          End Time: <NumberInput handleStateChange={handleChange} ind={3} inValue={0}/>
        </label>
        <label>
          Interval: <NumberInput handleStateChange={handleChange} ind={4} inValue={0}/>
        </label>
        <button onClick={handleInterest}>Calculate</button>
        <p>Values at each time: {result}</p>
    </>
  );
}

export default Interest;
