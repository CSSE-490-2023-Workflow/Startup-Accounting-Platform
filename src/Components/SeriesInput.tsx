import React, { ChangeEvent, useCallback, useEffect, useState} from 'react';
import { allowed_stack_components } from '../engine/datatype_def';
import NumberInput from './NumberInput';

interface IProps {
    handleStateChange: any
    ind: number
    inValues: number[]
    inputId: number
    
}

interface NumberInputDS {
    handleStateChange: any
    ind: number
    inValue: number | string
    inputId: number
}

function SeriesInput(props: IProps) {
  const { handleStateChange, ind, inValues, inputId} = props
  const [numberOfInputs, setNumberOfInputs] = useState(5);
  const changeInput = useCallback((inputId: number, newValue: number | string) => {
    console.log('in changeInput, blks are ', inpValues, inputId, newValue);
   const tmp: NumberInputDS[] = inpValues.map((blk: NumberInputDS, index: number) => {
       console.log('in changeInput',index);
       if (blk.inputId == inputId) {
           curValues[ind] = Number(newValue);
           setCurValues(curValues);

           console.log("changed");
       }
   //   console.log(blk.val);
       return blk;
   })
   setInpValues([...inpValues]);
   handleStateChange(inputId, inpValues.map((inpValue) => Number(curValues[inpValue.ind])))
   // console.log('tmp', inputBlocks);
   }, [])
  const temp = []
  for(let i = 0; i < numberOfInputs; i++) {
    temp.push({handleStateChange: changeInput, ind: i, inValue: inValues[i], inputId: i})
  }
  const [inpValues, setInpValues] = useState<NumberInputDS[]>(temp);
  const [curValues, setCurValues] = useState<number[]>(inValues)

    // useEffect(() => {
    //     const temp2 = []
    //     for(let i = 0; i < numberOfInputs; i++) {
    //         temp2.push({handleStateChange: changeInput, ind: i, inValue: 0, inputId: i})
    //     }
    //     setInpValues(temp2)
    // },[])
    
    const numInputs = inpValues.map((val: NumberInputDS) => {
        return <NumberInput handleStateChange={val.handleStateChange} ind={val.ind} inValue={val.inValue} inputId = {val.inputId} />
    });
//   <NumberInput handleStateChange={val.handleStateChange} ind={val.ind} inValue={inValues[i - 1]} inputId = {i - 1} />
    
    return (
    <>
     {numInputs}
    </>
    )
   
    
}

export default SeriesInput;
