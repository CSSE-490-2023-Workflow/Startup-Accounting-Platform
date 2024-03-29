import React, { useCallback, useState } from 'react';
import NumberInput from './Inputs/NumberInput';
import { func_2, func_interpreter_new_caller } from '../engine/engine'
import { XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries, HorizontalBarSeries, VerticalBarSeries } from 'react-vis';
import { allowed_stack_components } from '../engine/datatype_def';


function Interest() {
  const [inputs, setInputs] = useState([0, 0, 0])
  const [result, setResult] = useState<string>()
  const [op, setOp] = useState<number[][]>()
  const handleInterest = useCallback(() => {
    const json = {
      "type": "custom_function",
      'useOutput': 0,
      "outputs": [
        {
          'type' : 'output',
          'outputName': 'functionOutput',
          'outputIdx' : 1,
          'params' : [
            {
              "type": "builtin_function",
              "functionName": "apply_interest_rate",
              'useOutput': 0,
              "params": [
                {
                  "type": "input",
                  'inputIdx' : 1,
                  'inputName': 'interest rate',
                },
                {
                  "type": "builtin_function",
                  "functionName": "scalar_to_function_points",
                  'useOutput': 0,
                  "params": [
                    {
                      "type": "input",
                      'inputIdx': 2,
                      'inputName' : 'initial deposit'
                    },
                    {
                      "type": "input",
                      'inputIdx': 3,
                      "inputName": 'time'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
    interface ioObject {
      name : string,
      value : allowed_stack_components
    }
    const inputMap : Map<number, ioObject> = new Map<number, ioObject>();
    inputMap.set(1, {name: 'interest rate', value: inputs[1]});
    inputMap.set(2, {name: 'initial deposit', value: inputs[0]});
    inputMap.set(3, {name: 'time', value: inputs[2]});
    const out : ioObject | undefined = func_interpreter_new_caller(JSON.stringify(json), inputMap).get(1)
//    console.log('what have we here', func_interpreter_new_caller(JSON.stringify(json), inputMap).get(1));
    if (out == undefined) {
      throw new Error('undefined output. Check function definition.')
    } else {
      setOp(out['value'] as number[][])
    }
    setResult(JSON.stringify(op));
    //setResult(func_interpreter_new_caller(JSON.stringify(json), inputs[1], inputs[0], inputs[2]) as number[])
  }, [])
  const handleChange = useCallback((ind: number, value: number) => {
    inputs[ind] = value
    setInputs(inputs)
  }, [])
  return (
    <>
      <label>
        Initial Amount: <NumberInput handleStateChange={handleChange} inputIdx={0} inValue={0} inputId={null}/>
      </label>
      <label>
        Interest Rate: <NumberInput handleStateChange={handleChange} inputIdx={1} inValue={0} inputId={null}/>
      </label>
      {/* <label>
          Start Time: <NumberInput handleStateChange={handleChange} ind={2} inValue={0}/>
        </label> */}
      <label>
        End Time: <NumberInput handleStateChange={handleChange} inputIdx={2} inValue={0} inputId={null}/>
      </label>
      {/* <label>
          Interval: <NumberInput handleStateChange={handleChange} ind={4} inValue={0}/>
        </label> */}
      <button onClick={handleInterest}>Calculate</button>
      <p>Values at each time: {JSON.stringify(op)}</p>

      {op && op.length > 0 && (
        <div>
          <table style={{ border: '1px solid black' }}>
            <thead>
              <tr>
                <th>Time</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {op.map(([index, value], k) => (
                <tr key={k}>
                  <td>{index}</td>
                  <td>{value.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <XYPlot
            width={200}
            height={200}
            xDomain={[0,5.5]}
            yDomain={[0,150]}>
            <HorizontalGridLines />
            <VerticalBarSeries
              data={op.map(([index, value], k) => (
                {x: index, y: value}
              ))} barWidth={0.2} />
            <XAxis />
            <YAxis />
          </XYPlot>

        </div>



      )}


    </>
    
  );
}



export default Interest;
