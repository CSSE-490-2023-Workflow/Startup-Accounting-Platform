import React, { ChangeEvent, useCallback, useEffect, useState} from 'react';
import NumberInput from './NumberInput';

// interface IProps {
//     handleStateChange: any
//     inputId: number
//     inValues: number[][]
//     inputValueCap: number
// }


function DoubleSeriesInput(props: any) {
  const handleStateChange = props.handleStateChange
  const inputId = props.inputId
  const val = props.val
  //console.log(val)
  
  const [disabledInc, setDisabledInc] = useState<boolean>(false);
  const [disabledDec, setDisabledDec] = useState<boolean>(false);
  //const [inputs, setInputs] = useState<React.JSX.Element[]>([]);
//   useEffect(() => {
//     const temp = []
//     for(let i = 0; i < numberOfInputs; i++) {
//         temp.push({handleStateChange: changeInput, ind: i, inValue: curValues[i], inputId: i})
//     }
//     //console.log(temp);
//     setInpValues(temp);
//   }, [numberOfInputs])
  const changeInput = (inputIdx: number, placeholder0: any, placeholder1: any, placeholder2: any, newValue: number | string) => {
    handleStateChange(inputId, null, null, null, val.map((currVal: number[], index: number) => {
      //console.log(index, inputIdx)
      if (index == inputIdx) {
        return [Number(newValue), currVal[1]]       
      } else if (index + val.length == inputIdx){
        return [currVal[0], Number(newValue)]
      }
      return currVal;
    }))
    // //console.log('tmp', inputBlocks);
  }

  
 
  const incrementNumber = () => {
    handleStateChange(inputId, null, null, null, [...val, [val.length, 0]])
  }
  const decrementNumber = () => {
    handleStateChange(inputId, null, null, null, val.slice(0, val.length - 1))
  }

    const inputs = val.map((currVal: number[], index: number) => {
      return <div style={{flexDirection: "row", display: "flex"}}>
                <NumberInput handleStateChange={changeInput} inputIdx={index} inValue={currVal[0]} inputId={null} />
                <NumberInput handleStateChange={changeInput} inputIdx={index + val.length} inValue={currVal[1]} inputId={null} />
              </div>
    })
   
//   <NumberInput handleStateChange={val.handleStateChange} ind={val.ind} inValue={inValues[i - 1]} inputId = {i - 1} />
    
    return (
    <div style={{display: "flex", flexDirection: "column"}}>
     <button disabled={disabledInc} onClick={incrementNumber}>Add input</button>
     <button disabled={disabledDec} onClick={decrementNumber}>Remove input</button>
     <div style={{gap: "80px", margin: "auto", display: "flex", flexDirection: "row"}}>
      <div>X-axis variable</div>
      <div>Y-axis Variable</div>
     </div>
     {inputs}
    </div>
    )
   
    
}

export default DoubleSeriesInput;
