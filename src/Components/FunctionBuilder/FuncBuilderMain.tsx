import React, { useCallback, useState } from 'react';
import AddBlockButton from './AddBlockButton';
import { data_types } from '../../engine/datatype_def'
import InputBlock from './InputBlock';
import '../../Styles/FuncBuilderBlk.css'

interface InputBlockDS {
  inputId: number
  inputName: string
  inputType: data_types
}
function FuncBuilderMain() {
  const [inputs, setInputs] = useState([0,0])
  const [result, setResult] = useState(0)
  const [inputBlocks, setInputBlocks] = useState<InputBlockDS[]>([])
  const [currInputBlockId, setCurrInputBlockId] = useState(0)

  const addInputBlock = useCallback((inputName: string, inputType: data_types) => {
    const newId = currInputBlockId + 1;
    setCurrInputBlockId(newId);
    const newInputBlock : InputBlockDS = {
      inputId: newId,
      inputName: inputName,
      inputType: inputType
    }
    setInputBlocks([...inputBlocks, newInputBlock]) 
  }, [currInputBlockId, inputBlocks, setCurrInputBlockId, setInputBlocks])

  const removeInputBlock = useCallback((inputId: number) => {
    const localInputBlocks = inputBlocks.filter((blk) => {
      return blk.inputId != inputId
    })
    setInputBlocks(localInputBlocks) 
  }, [inputBlocks, setInputBlocks])

  const editInputBlock = useCallback((inputId: number, inputName: string, inputType: data_types) => {
    console.log('edit callback', inputId, inputName, inputType);
    const tmp: InputBlockDS[] = inputBlocks.map((blk: InputBlockDS) => {
      if (blk.inputId == inputId) {
        blk.inputName = inputName;
        blk.inputType = inputType;
      }
      return blk;
    })
    setInputBlocks(tmp) 
  }, [inputBlocks])

  const inputBlocksList = inputBlocks.map((blk: InputBlockDS) => {
    return (
      <InputBlock 
        inputId={blk.inputId} inputName={blk.inputName} inputType={blk.inputType} 
        updateBlkCB={editInputBlock} 
        removeBlkCB={removeInputBlock}
      />
    );
  })

  return (
    <>
        <AddBlockButton onClick={addInputBlock}/>
        <h1>hello world</h1>
        {inputBlocksList}
    </>
  );
}

export default FuncBuilderMain;
