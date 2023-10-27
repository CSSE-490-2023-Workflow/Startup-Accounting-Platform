import React, { ChangeEvent, useCallback, useState} from 'react';

interface IProps {
    handleStateChange: (ind: number, value: number) => void
    ind: number
    inValue: number | string
}

function NumberInput(props: IProps) {
  const { handleStateChange, ind, inValue} = props
  const [inpValue, setInpValue] = useState(inValue);
  const handleChange= useCallback((event: ChangeEvent) => {
    const { value } = event.target as HTMLInputElement
    if(value === "" || value === "-") {
        handleStateChange(ind, 0)
        setInpValue(value)
    }
    else {
      let modifiedValue = value;
      if(value.charAt(value.length - 1) === '.' && value.indexOf(".") === value.length - 1) {
        modifiedValue = value.replace(".","")
      }
      if(!isNaN(Number(modifiedValue))) {
        handleStateChange(ind, Number(modifiedValue))
        setInpValue(value)
      }
  }
  }, [])
  return <input onChange={handleChange} value = {inpValue}></input>;
}

export default NumberInput;
