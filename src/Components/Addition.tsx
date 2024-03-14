import React, { useCallback, useState } from 'react';
import NumberInput from './Inputs/NumberInput';
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
            'outputIdx': 1,
            'params': [
              {
                "type" : "builtin_function",
                "functionName" : "scalar_addition",
                'useOutput': 0,
                "params" : [
                    {
                        "type" : "input",
                        'inputIdx' : 1,
                        "inputName" : 'input1'
                    },
                    {
                        "type" : "input",
                        'inputIdx' : 2,
                        "inputName" : 'input2'
                    }
                ]
            }
            ]
          }
        ],
    }

    interface ioObj {
      name : string,
      value : allowed_stack_components
    }
    const paramMap : Map<number, ioObj> = new Map<number, ioObj>();
    paramMap.set(1, {name: 'input1', value: inputs[0]});
    paramMap.set(2, {name: 'input2', value: inputs[1]});
    console.log(`inputs2: ${inputs[1]}`)
    const tmp : ioObj |undefined = func_interpreter_new_caller(JSON.stringify(json), paramMap).get(1);
    if (tmp == undefined) {
      throw new Error('undefined result. Check function definition')
    } else {
      setResult(tmp['value'] as number)
    }
    
  }, [])
  const handleChange = useCallback((ind: number, value: number) => {
    inputs[ind] = value
    setInputs([...inputs])
  }, [])
  return (
    <>
        <label>
          First number: <NumberInput handleStateChange={handleChange} ind={0} inValue={0} inputId={0} />
        </label>
        <label>
          Second number: <NumberInput handleStateChange={handleChange} ind={1} inValue={0} inputId={1} />
        </label>
        <button onClick={handleAdd}>Add</button>
        <p>Sum: {result}</p>
    </>
  );
}


export default Addition;
