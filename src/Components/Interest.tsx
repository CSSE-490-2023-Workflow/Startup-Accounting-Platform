import React, { useCallback, useState } from 'react';
import NumberInput from './NumberInput';
import { func_interpreter, func_2, func_interpreter_new_caller } from '../engine/engine'
import { XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries, HorizontalBarSeries, VerticalBarSeries } from 'react-vis';


function Interest() {
  const [inputs, setInputs] = useState([0, 0, 0])
  const [result, setResult] = useState<string>()
  const [op, setOp] = useState<number[][][]>([])
  const handleInterest = useCallback(() => {
    const json = {
      "type": "builtin_function",
      "name": "return",
      "param": [
        {
          "type": "builtin_function",
          "name": "apply_interest_rate",
          "param": [
            {
              "type": "argument",
              "index": 0
            },
            {
              "type": "builtin_function",
              "name": "scalar_to_function_points",
              "param": [
                {
                  "type": "argument",
                  "index": 1
                },
                {
                  "type": "argument",
                  "index": 2
                }
              ]
            }
          ]
        }
      ]
    }
    console.log('what have we here', func_interpreter_new_caller(JSON.stringify(json), inputs[1], inputs[0], inputs[2]));
    setOp(func_interpreter_new_caller(JSON.stringify(json), inputs[1], inputs[0], inputs[2]) as number[][][])
    setResult(JSON.stringify(op));
    // setResult(func_interpreter_new_caller(JSON.stringify(json), inputs[1], inputs[0], inputs[2]) as number[])
  }, [])
  const handleChange = useCallback((ind: number, value: number) => {
    inputs[ind] = value
    setInputs(inputs)
  }, [])
  return (
    <>
      <label>
        Initial Amount: <NumberInput handleStateChange={handleChange} ind={0} inValue={0} />
      </label>
      <label>
        Interest Rate: <NumberInput handleStateChange={handleChange} ind={1} inValue={0} />
      </label>
      {/* <label>
          Start Time: <NumberInput handleStateChange={handleChange} ind={2} inValue={0}/>
        </label> */}
      <label>
        End Time: <NumberInput handleStateChange={handleChange} ind={2} inValue={0} />
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
              {op[0].map(([index, value], k) => (
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
              data={op[0].map(([index, value], k) => (
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
