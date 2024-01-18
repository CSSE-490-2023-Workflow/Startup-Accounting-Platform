import React, { useCallback, useState } from 'react';
import NumberInput from './NumberInput';
import { func_interpreter_new_caller} from '../engine/engine'
import { allowed_stack_components } from '../engine/datatype_def';


function Addition() {
  const [inputs, setInputs] = useState([0,0])
  const [result, setResult] = useState(0)
  const handleAdd = useCallback(() => {
    // setResult(Number(func_interpreter(func_2, ...inputs)[0]))
    const json = {
        "type" : "custom_function",
        'useOutput': 0,
        "outputs" : [
          {
            'type': 'output',
            'outputName': 'out',
            'params': [
              {
                "type" : "builtin_function",
                "functionName" : "scalar_addition",
                'useOutput': 0,
                "params" : [
                    {
                        "type" : "input",
                        "inputName" : 'input1'
                    },
                    {
                        "type" : "input",
                        "inputName" : 'input2'
                    }
                ]
            }
            ]
          }
        ],
    }
    const paramMap : Map<string, allowed_stack_components> = new Map<string, allowed_stack_components>();
    paramMap.set('input1', inputs[0]);
    paramMap.set('input2', inputs[1]);
    setResult(func_interpreter_new_caller(JSON.stringify(json), paramMap).get('out') as number)
    
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
