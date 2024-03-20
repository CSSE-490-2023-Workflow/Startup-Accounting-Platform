import React, { ChangeEvent, Dispatch, SetStateAction, useCallback, useEffect, useState} from 'react';
import NumberInput from './NumberInput';
import CsvImportModal from './CsvImportModal';
import { Button } from '@mantine/core';
import { allowed_stack_components } from '../../engine/datatype_def';

interface IProps {
    handleStateChange: any
    inputId: number
    inputValueCap: number
    val: allowed_stack_components
    setVal: Dispatch<SetStateAction<allowed_stack_components>>
    // setFocusedInput: (idx: number | null) => void 
    // openCsvImportDialog: () => void
}

interface NumberInputDS {
    handleStateChange: any
    ind: number
    inValue: number | string
    inputId: number
}

function SeriesInput(props: IProps) {
  const handleStateChange = props.handleStateChange
  const inputId = props.inputId
  const inputValueCap = props.inputValueCap
  const setVal = props.setVal
  const val = props.val as number[]
  const [numberOfInputs, setNumberOfInputs] = useState(val.length);
  
  // const [curValues, setCurValues] = useState<number[]>(inValues)
  const [disabledInc, setDisabledInc] = useState<boolean>(false);
  
  const [disabledDec, setDisabledDec] = useState<boolean>(false);
  const [inputs, setInputs] = useState<React.JSX.Element[]>([]);
//   useEffect(() => {
//     const temp = []
//     for(let i = 0; i < numberOfInputs; i++) {
//         temp.push({handleStateChange: changeInput, ind: i, inValue: curValues[i], inputId: i})
//     }
//     console.log(temp);
//     setInpValues(temp);
//   }, [numberOfInputs])

  // placeholder params are for keeping the format same as editInputBlock in main
  const changeInput = useCallback((inputIdx: number, placeholder0: any, placeholder1: any, placeholder2: any, newValue: number | string) => {
    
    /**
     * This call will change the values stored in the InputBlockDS is main
     */
    handleStateChange(inputId, null, null, null, val.map((currVal: number, index: number) => {
    //console.log('in changeInput',blk.inputId, inputId);
      if (index == inputIdx) {
        return Number(newValue)
      }
      return currVal;
    }))
    /**
     * This updates the values displayed 
     */
    
    //setVal([...val]);
   // console.log('tmp', inputBlocks);
  }, [val, numberOfInputs])
//    setInpValues([])
//   useEffect(() => {
//     const temp = []
//     for(let i = 0; i < numberOfInputs; i++) {
//       temp.push({handleStateChange: changeInput, ind: i, inValue: inValues[i], inputId: i})
//     }
//     setInpValues(temp);
//   }, [numberOfInputs, setNumberOfInputs])

  
 
  const incrementNumber = () => {
    // setCurValues((curValues) => [...curValues, 0])
    // setInpValues((inpValues) => [...inpValues, {handleStateChange: changeInput, ind: numberOfInputs, inValue: inValues[numberOfInputs], inputId: numberOfInputs}])
    handleStateChange(inputId, null, null, null, [...val, 0])
    //setVal((curValues) => [...(curValues as number[]), 0])
    //setNumberOfInputs((numberOfInputs) => numberOfInputs + 1)
  }


  const decrementNumber = () => {
    
    handleStateChange(inputId, null, null, null, val.slice(0, val.length - 1))
    //setVal(val.slice(0, numberOfInputs - 1))
    //setNumberOfInputs((numberOfInputs) => numberOfInputs - 1)
    // setCurValues((curValues) => {
    //     curValues.pop()
    //     return curValues;
    // });
    // setInpValues((inpValues) => {
    //     inpValues.pop()
    //     return inpValues;
    // })
  }
    // useEffect(() => {
    //     const temp2 = []
    //     for(let i = 0; i < numberOfInputs; i++) {
    //         temp2.push({handleStateChange: changeInput, ind: i, inValue: 0, inputId: i})
    //     }
    //     setInpValues(temp2)
    // },[])

    

    // useEffect(() => {
    //   console.log('curvals')
    //   console.log(curValues)
    //     setDisabledInc(numberOfInputs >= inputValueCap);
    //     setDisabledDec(numberOfInputs <= 0);
    //     setInputs(curValues.map((val: number, index: number) => {
    //         return <NumberInput handleStateChange={changeInput} inputIdx={index} inValue={val} inputId={null} />
    //     }));
    // }, [curValues, numberOfInputs])
    console.log('rendering', val)
    const newInputs = val.map((currVal: number, index: number) => {
      return <NumberInput handleStateChange={changeInput} inputIdx={index} inValue={currVal} inputId={null} />
    });


   
//   <NumberInput handleStateChange={val.handleStateChange} ind={val.ind} inValue={inValues[i - 1]} inputId = {i - 1} />
    
    return (
    <div style={{flexDirection: "row"}}>
     <button disabled={disabledInc} onClick={incrementNumber}>Add input</button>
     <button disabled={disabledDec} onClick={decrementNumber}>Remove input</button>
     {/* <Button variant='default' onClick={() => {openCsvImportDialog(); setFocusedInput(ind)}}> import from csv</Button> */}
     {newInputs}
    </div>
    )
   
    
}

export default SeriesInput;