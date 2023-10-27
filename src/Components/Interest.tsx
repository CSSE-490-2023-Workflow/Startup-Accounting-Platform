import React, { useCallback, useState } from 'react';
import NumberInput from './NumberInput';
import { func_interpreter, func_2, func_interpreter_new_caller} from '../engine/engine'

function Interest() {
  const [inputs, setInputs] = useState([0, 0, 0])
  const [result, setResult] = useState<number[]>([])
  const handleInterest = useCallback(() => {
    const json = {
        "type" : "builtin_function",
        "name" : "return",
        "param" : [
            {
                "type" : "builtin_function",
                "name" : "apply_interest_rate",
                "param" : [
                    {
                        "type" : "argument",
                        "index" : 0
                    },
                    {
                        "type" : "builtin_function",
                        "name" : "scalar_to_function_points",
                        "param" : [
                            {
                                "type" : "argument",
                                "index" : 1
                            },
                            {   
                                "type" : "argument",
                                "index" : 2
                            }
                        ]
                    }
                ]
            }
        ]
    }
    console.log(func_interpreter_new_caller(JSON.stringify(json), inputs[1], inputs[0], inputs[2]));
    setResult(func_interpreter_new_caller(JSON.stringify(json), inputs[1], inputs[0], inputs[2]) as number[])
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
        {/* <label>
          Start Time: <NumberInput handleStateChange={handleChange} ind={2} inValue={0}/>
        </label> */}
        <label>
          End Time: <NumberInput handleStateChange={handleChange} ind={3} inValue={0}/>
        </label>
        {/* <label>
          Interval: <NumberInput handleStateChange={handleChange} ind={4} inValue={0}/>
        </label> */}
        <button onClick={handleInterest}>Calculate</button>
        <p>Values at each time: {result}</p>
    </>
  );
}

export default Interest;
