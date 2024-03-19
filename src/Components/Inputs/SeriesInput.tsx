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
  console.log(props)
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
    //console.log('in changeInput, blks are ', inputId, newValue, numberOfInputs);
  //   setCurValues(curValues.map((val: number, index: number) => {
  //     //console.log('in changeInput',blk.inputId, inputId);
  //      if (index == inputId) {
  //         return Number(newValue)
  //       //    curValues[ind] = Number(newValue);
  //       //    setCurValues([...curValues]);

  //       //    console.log("changed");
  //      }
  //      console.log(val);
  //      return val;
  //  }))
//    setInpValues([...tmp]);
   console.log(val.map((val: number, index: number) => {
     if (index == inputIdx) {
        return Number(newValue)
      //    curValues[ind] = Number(newValue);
      //    setCurValues([...curValues]);
     }
     return val;
 }));

   handleStateChange(inputId, null, null, null, val.map((currVal: number, index: number) => {
    //console.log('in changeInput',blk.inputId, inputId);
     if (index == inputIdx) {
        val[inputIdx] = Number(newValue);
        setVal([...val]);
        return Number(newValue)
     }
 //   console.log(blk.val);
     return val;
 }))
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

  
 
  const incrementNumber = useCallback(() => {
    // setCurValues((curValues) => [...curValues, 0])
    // setInpValues((inpValues) => [...inpValues, {handleStateChange: changeInput, ind: numberOfInputs, inValue: inValues[numberOfInputs], inputId: numberOfInputs}])
    let temp = val.map((value) => value);
    temp.push(0)
    handleStateChange(inputId, null, null, null, temp)
    setVal((curValues) => [...(curValues as number[]), 0])
    setNumberOfInputs((numberOfInputs) => numberOfInputs + 1)
  },[val, numberOfInputs])
  const decrementNumber = useCallback(() => {
    console.log(val.slice(0, numberOfInputs - 1).length);
    handleStateChange(inputId, null, null, null, val.slice(0, numberOfInputs - 1))
    setVal(val.slice(0, numberOfInputs - 1))
    setNumberOfInputs((numberOfInputs) => numberOfInputs - 1)
    // setCurValues((curValues) => {
    //     curValues.pop()
    //     return curValues;
    // });
    // setInpValues((inpValues) => {
    //     inpValues.pop()
    //     return inpValues;
    // })
  },[val, numberOfInputs])
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