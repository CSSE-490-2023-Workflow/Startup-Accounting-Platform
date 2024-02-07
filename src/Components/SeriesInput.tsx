import React, { ChangeEvent, useCallback, useEffect, useState} from 'react';
import NumberInput from './NumberInput';

interface IProps {
    handleStateChange: any
    ind: number
    inValues: number[]
    inputValueCap: number
    
}

interface NumberInputDS {
    handleStateChange: any
    ind: number
    inValue: number | string
    inputId: number
}

function SeriesInput(props: IProps) {
  const { handleStateChange, inValues, inputValueCap, ind} = props
  const [numberOfInputs, setNumberOfInputs] = useState(inValues.length);
  console.log("made empty");
//   const [inpValues, setInpValues] = useState<NumberInputDS[]>(inValues.map(() => {

//   }));
//   console.log(inpValues);
  const [curValues, setCurValues] = useState<number[]>(inValues)
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
  const changeInput = useCallback((inputId: number, newValue: number | string) => {
    console.log('in changeInput, blks are ', inputId, newValue, numberOfInputs);
    setCurValues(curValues.map((val: number, index: number) => {
      //console.log('in changeInput',blk.inputId, inputId);
       if (index == inputId) {
          return Number(newValue)
        //    curValues[ind] = Number(newValue);
        //    setCurValues([...curValues]);

        //    console.log("changed");
       }
       console.log(val);
       return val;
   }))
//    setInpValues([...tmp]);
   console.log("here");
   handleStateChange(ind, curValues.map((val: number, index: number) => {
    //console.log('in changeInput',blk.inputId, inputId);
     if (index == inputId) {
        console.log("changed", newValue);
        return Number(newValue)
      //    curValues[ind] = Number(newValue);
      //    setCurValues([...curValues]);
     }
 //   console.log(blk.val);
     return val;
 }))
   // console.log('tmp', inputBlocks);
   }, [curValues, numberOfInputs])
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
    let temp = curValues.map((value) => value);
    temp.push(0)
    handleStateChange(ind, temp)
    setCurValues((curValues) => [...curValues, 0])
    setNumberOfInputs((numberOfInputs) => numberOfInputs + 1)
  },[curValues, numberOfInputs])
  const decrementNumber = useCallback(() => {
    console.log(curValues.slice(0, numberOfInputs - 1).length);
    handleStateChange(ind, curValues.slice(0, numberOfInputs - 1))
    setCurValues(curValues.slice(0, numberOfInputs - 1))
    setNumberOfInputs((numberOfInputs) => numberOfInputs - 1)
    // setCurValues((curValues) => {
    //     curValues.pop()
    //     return curValues;
    // });
    // setInpValues((inpValues) => {
    //     inpValues.pop()
    //     return inpValues;
    // })
  },[curValues, numberOfInputs])
    // useEffect(() => {
    //     const temp2 = []
    //     for(let i = 0; i < numberOfInputs; i++) {
    //         temp2.push({handleStateChange: changeInput, ind: i, inValue: 0, inputId: i})
    //     }
    //     setInpValues(temp2)
    // },[])
    useEffect(() => {
        setDisabledInc(numberOfInputs >= inputValueCap);
        setDisabledDec(numberOfInputs <= 0);
        setInputs(curValues.map((val: number, index: number) => {
            return <NumberInput handleStateChange={changeInput} ind={index} inValue={val} inputId = {index} />
        }));
    }, [curValues, numberOfInputs])
   
//   <NumberInput handleStateChange={val.handleStateChange} ind={val.ind} inValue={inValues[i - 1]} inputId = {i - 1} />
    
    return (
    <div style={{flexDirection: "column"}}>
     <button disabled={disabledInc} onClick={incrementNumber}>Add input</button>
     <button disabled={disabledDec} onClick={decrementNumber}>Remove input</button>
     {inputs}
    </div>
    )
   
    
}

export default SeriesInput;
