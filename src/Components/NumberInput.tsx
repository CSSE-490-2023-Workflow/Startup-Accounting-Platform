import React, { ChangeEvent, useCallback, useState} from 'react';

interface IProps {
    handleStateChange: (ind: number, value: number) => void
    ind: number
    inValue: number | ""
}

function NumberInput(props: IProps) {
    const { handleStateChange, ind, inValue} = props
  const [inpValue, setInpValue] = useState(inValue);
  const handleChange= useCallback((event: ChangeEvent) => {
    const { value } = event.target as HTMLInputElement
    if(value === "") {
        handleStateChange(ind, 0)
        setInpValue("")
    }
    else if(!isNaN(Number(value))) {
        handleStateChange(ind, Number(value))
        setInpValue(Number(value))
    }
  }, [])
  return (
    <div className="App">
      <input onChange={handleChange} value = {inpValue}></input>
    </div>
  );
}

export default NumberInput;
