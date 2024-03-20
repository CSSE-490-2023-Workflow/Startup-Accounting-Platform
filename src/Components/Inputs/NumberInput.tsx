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
  console.log(props)
  function handleChange(e: ChangeEvent) {
    const { value } = e.target as HTMLInputElement
    if(value === "" || value === "-") {
        if (inputId == null) {
          handleStateChange(inputIdx, null, null, null, 0)
        } else {
          handleStateChange(inputId, null, null, null, 0)
        }
        
        //setInpValue(value)
    }
    else {
      let modifiedValue = value;
      if(value.charAt(value.length - 1) === '.' && value.indexOf(".") === value.length - 1) {
        modifiedValue = value.replace(".","")
      }
      if(!isNaN(Number(modifiedValue))) {
        if (inputId == null) { //This is a component used in SeriesInput
          handleStateChange(inputIdx, null, null, null, Number(modifiedValue))
        } else { 
          handleStateChange(inputId, null, null, null, Number(modifiedValue))
        }
        //setInpValue(value)
      }
    }
  }
  return <input onChange={handleChange} value = {inValue}></input>;
}

export default NumberInput;
