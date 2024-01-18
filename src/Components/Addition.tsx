import React, { useCallback, useState } from 'react';
import NumberInput from './NumberInput';
import { func_interpreter_new_caller} from '../engine/engine'

/*
function Addition() {
  const [inputs, setInputs] = useState([0,0])
  const [result, setResult] = useState(0)
  const handleAdd = useCallback(() => {
    // setResult(Number(func_interpreter(func_2, ...inputs)[0]))
    const json = {
        "type" : "builtin_function",
        "name" : "return",
        "param" : [
            {
                "type" : "builtin_function",
                "name" : "scalar_addition",
                "param" : [
                    
                    {
                        "type" : "argument",
                        "index" : 0
                    },
                    {
                        "type" : "argument",
                        "index" : 1
                    }
                ]
            }
        ]
    }
    setResult(func_interpreter_new_caller(JSON.stringify(json), inputs[0], inputs[1])[0] as number)
    
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
*/

function Addition() {
  return <h1>This functionality is temporarily disabled.</h1>
}

export default Addition;
