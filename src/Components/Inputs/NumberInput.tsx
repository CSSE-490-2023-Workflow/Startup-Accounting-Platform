import React, { ChangeEvent, useCallback, useState} from 'react';

/**
 * One of inputIdx and inputId should be null
 * If this is a component used in main, idx should be null b/c main's editCB uses blockId for identification
 * If this is a component used in SeriesInput, id should be null 
 * 
 */
interface IProps {
    handleStateChange: any
    inputIdx: number | null
    inValue: number | string
    inputId: number | null
}

function NumberInput(props: IProps) {
  const { handleStateChange, inputIdx, inValue, inputId} = props
  const [ val, setVal ] = useState(inValue)
  console.log(props)
  function handleChange(e: ChangeEvent) {
    const { value } = e.target as HTMLInputElement
    // if(value === "" || value === "-") {
    //     if (inputId == null) {
    //       handleStateChange(inputIdx, null, null, null, 0)
    //       setVal(0)
    //     } else {
    //       handleStateChange(inputId, null, null, null, 0)
    //       setVal(0)
    //     }
        
    //     //setInpValue(value)
    // }
    
    if(!isNaN(Number(value))) {
      if (inputId == null) { //This is a component used in SeriesInput
        handleStateChange(inputIdx, null, null, null, Number(value))
        setVal(value)
      } else { 
        handleStateChange(inputId, null, null, null, Number(value))
        setVal(value)
      }
      //setInpValue(value)
    } else {

    }
     
  }
  return <input onChange={handleChange} value = {val} type='number'></input>;
}

export default NumberInput;
