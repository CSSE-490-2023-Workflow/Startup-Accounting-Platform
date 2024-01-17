import React, { useCallback, useState } from 'react';
import AddBlockButton from './AddBlockButton';
import { data_types, builtin_function, data_type_enum_name_pairs} from '../../engine/datatype_def'
import { id_to_builtin_func } from '../../engine/builtin_func_def'
import InputBlock from './InputBlock';
import FuncBlock from './FuncBlock';
import '../../Styles/FuncBuilderBlk.css'
//import '../../lib/font-awesome-4.7.0/css/font-awesome.min.css'
import * as utils from './utils.json'
import OutputBlock from './OutputBlock';
import Xarrow from 'react-xarrows';

interface InputBlockDS {
  blockId: number
  inputName: string
  inputType: data_types
}

interface FuncBlockDS {
  blockId: number
  funcName: string
  funcId: number
  paramTypes: data_types[]
  paramNames: string[]
  outputTypes: data_types[]
  outputNames: string[]
}

interface OutputBlockDS {
  blockId: number
  outputName: string
  outputType: data_types
}

interface StartAndEnd {
  start: string;
  end: string;
}

const config = utils;

interface StartAndEnd {
  start: string;
  end: string;
}

function FuncBuilderMain() {

  const [arrows, setArrows] = useState<StartAndEnd[]>([]);
  const addArrow = (value: StartAndEnd) => {
    setArrows([...arrows, value]);
  };

  //const [inputs, setInputs] = useState([0,0])
  //const [result, setResult] = useState(0)
  const [inputBlocks, setInputBlocks] = useState<InputBlockDS[]>([])
  const [funcBlocks, setFuncBlocks] = useState<FuncBlockDS[]>([])
  const [outputBlocks, setOutputBlocks] = useState<OutputBlockDS[]>([])
  const [currBlockId, setCurrBlockId] = useState(0)

  /**
   * Input block Logics
   */
  const addInputBlock = useCallback((inputName: string, inputType: data_types) => {
    const newId = currBlockId + 1;
    setCurrBlockId(newId);
    const newInputBlock : InputBlockDS = {
      blockId: newId,
      inputName: inputName,
      inputType: inputType
    }
    setInputBlocks([...inputBlocks, newInputBlock]) 
  }, [currBlockId, inputBlocks, setCurrBlockId, setInputBlocks])

  const removeInputBlock = useCallback((inputId: number) => {
    setInputBlocks(inputBlocks.filter((blk) => {
      return blk.blockId != inputId
    })) 
  }, [inputBlocks, setInputBlocks])

  const editInputBlock = useCallback((blkId: number, inputName: string, inputType: data_types) => {
    if (config.debug_mode_FuncBuilder == 1) {
      console.log('edit callback', blkId, inputName, inputType);
      console.log("current input blocks in parents", inputBlocks);
    }
    const tmp: InputBlockDS[] = inputBlocks.map((blk: InputBlockDS) => {
      if (blk.blockId == blkId) {
        blk.inputName = inputName;
        blk.inputType = inputType;
      }
      return blk;
    })
    setInputBlocks(tmp) 
  }, [inputBlocks, setInputBlocks])

  /**
   * Output block logics
   */
  const addOutputBlock = useCallback((outputName: string, outputType: data_types) => {
    const newId = currBlockId + 1;
    setCurrBlockId(newId);
    const newBlock : OutputBlockDS = {
      blockId: newId,
      outputName: outputName,
      outputType: outputType
    }
    setOutputBlocks([...outputBlocks, newBlock]) 
  }, [currBlockId, outputBlocks, setCurrBlockId, setOutputBlocks])

  const removeOutputBlock = useCallback((blkId: number) => {
    setOutputBlocks(outputBlocks.filter((blk) => {
      return blk.blockId != blkId
    })) 
  }, [outputBlocks, setOutputBlocks])

  const editOutputBlock = useCallback((blkId: number, outputName: string, outputType: data_types) => {
    if (config.debug_mode_FuncBuilder == 1) {
      console.log('edit callback', blkId, outputName, outputType);
      console.log("current output blocks in parents", outputBlocks);
    }
    const tmp: OutputBlockDS[] = outputBlocks.map((blk: OutputBlockDS) => {
      if (blk.blockId == blkId) {
        blk.outputName = outputName;
        blk.outputType = outputType;
      }
      return blk;
    })
    setOutputBlocks(tmp) 
  }, [outputBlocks, setOutputBlocks])


  /**
   * Function block logics
   */
  //right now this is hard-coded for built-in functions only
  const addFuncBlock = useCallback((funcId: number) => {
    const newId = currBlockId + 1;
    setCurrBlockId(newId);
    const f: builtin_function = id_to_builtin_func[funcId];
    const newFuncBlock : FuncBlockDS = {
      blockId: newId,
      funcId: funcId,
      funcName: f.func_name,
      paramTypes: f.param_types,
      paramNames: f.param_names,
      outputTypes: f.output_types,
      outputNames: f.output_names
    }
    setFuncBlocks([...funcBlocks, newFuncBlock]) 
  }, [currBlockId, funcBlocks, setCurrBlockId, setFuncBlocks])

  const removeFuncBlock = useCallback((id: number) => {
    setFuncBlocks(funcBlocks.filter((blk: FuncBlockDS) => {
      return blk.blockId != id;
    }));
  }, [funcBlocks, setFuncBlocks])

  const editFuncBlock = useCallback((funcBlockId: number, funcId: number) => {
    if (config.debug_mode_FuncBuilder == 1) {
      console.log('edit func block callback', funcBlockId, funcId);
      console.log("current function blocks in parents", funcBlocks);
    }
    const tmp: FuncBlockDS[] = funcBlocks.map((blk: FuncBlockDS) => {
      if (blk.blockId == funcBlockId) {
        blk.funcId = funcId;
        const f: builtin_function = id_to_builtin_func[funcId];
        blk.funcName = f.func_name;
        blk.paramTypes = f.param_types;
        blk.paramNames = f.param_names;
        blk.outputTypes = f.output_types;
        blk.outputNames = f.output_names;
        console.log(blk);
      }
      return blk;
    })
    setFuncBlocks(tmp) 
  }, [funcBlocks, setFuncBlocks])
  
  interface funcInfo {
    id: number;
    name: string;
  }
  const func_options: funcInfo[] = Object.entries(id_to_builtin_func).map(([funcId, funcBody]) => {
    return {id: Number(funcId), name: funcBody.func_name};
  })

  const inputBlocksList = inputBlocks.map((blk: InputBlockDS) => {
    return (
      <InputBlock 
        blockId={blk.blockId} 
        inputName={blk.inputName} 
        inputType={blk.inputType} 
        inputTypeOptions={data_type_enum_name_pairs}
        updateBlkCB={editInputBlock} 
        removeBlkCB={removeInputBlock}
        setArrows={setArrows}
      />
    );
  })

  const funcBlocksList = funcBlocks.map((blk: FuncBlockDS) => {

    return (
      <FuncBlock
        blockId={blk.blockId}
        funcId={blk.funcId}
        funcName={blk.funcName}
        funcOptions={func_options}
        paramTypes={blk.paramTypes}
        paramNames={blk.paramNames}
        outputTypes={blk.outputTypes}
        outputNames={blk.outputNames}
        updateBlkCB={editFuncBlock}
        removeBlkCB={removeFuncBlock}
        addArrow={addArrow}
        setArrows={setArrows}
      />
    );
    
  })

  const outputBlocksList = outputBlocks.map((blk: OutputBlockDS) => {
    return (
      <OutputBlock
        blockId={blk.blockId}
        outputName={blk.outputName}
        outputType={blk.outputType}
        updateBlkCB={editOutputBlock} 
        removeBlkCB={removeOutputBlock}
        addArrow={addArrow}
        setArrows={setArrows}
      />
    )
  })


  return (
    <>
        <AddBlockButton onClick={addInputBlock} buttonText="Add Input Block" defaultAttr={["new input", data_types.dt_number]}/>
        <AddBlockButton onClick={addFuncBlock} buttonText="Add Function Block" defaultAttr={[1]}/>
        <AddBlockButton onClick={addOutputBlock} buttonText="Add Output Block" defaultAttr={["new output", data_types.dt_number]}/>
        <h3>Function Builder</h3>
        {inputBlocksList}
        {funcBlocksList}
        {outputBlocksList}
        {arrows.map(ar => (
        <Xarrow
          start={ar.start}
          end={ar.end}
          key={ar.start + "-." + ar.start}
        />
      ))}
    </>
  );
}

export default FuncBuilderMain;
