import React, { ChangeEvent, useCallback, useState} from 'react';
import { allowed_stack_components } from '../engine/datatype_def';

interface IProps {
    handleStateChange: any
    ind: number
    inValue: number | string
    inputId: number
    
}

function NumberInput(props: IProps) {
  const { handleStateChange, ind, inValue, inputId} = props
  const [inpValue, setInpValue] = useState(inValue);
  const handleChange= useCallback((event: ChangeEvent) => {
    const { value } = event.target as HTMLInputElement
    if(value === "" || value === "-") {
        handleStateChange(inputId, 0)
        setInpValue(value)
    }
    else {
      let modifiedValue = value;
      if(value.charAt(value.length - 1) === '.' && value.indexOf(".") === value.length - 1) {
        modifiedValue = value.replace(".","")
      }
      if(!isNaN(Number(modifiedValue))) {
        handleStateChange(inputId, Number(modifiedValue));
        setInpValue(value)
      }
  }
  }, [inpValue])
  return <input onChange={handleChange} value = {inpValue}></input>;
}

export default NumberInput;
