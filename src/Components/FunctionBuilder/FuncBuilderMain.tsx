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
import { saveAs } from 'file-saver';
import Xarrow from 'react-xarrows';
import { database } from "../../auth/firebase";

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

type blk = FuncBlockDS | OutputBlockDS | InputBlockDS;

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
  const [savedFunction, setSavedFunction] = useState({});

  const [ blkMap, setBlkMap ] = useState(new Map<number, blk>());

  const saveFunction = useCallback(() => {
    console.log('saving')
    const tmp : any[] = [];
    for (const outputBlk  of outputBlocks) {
      let path : any = {
        type : 'output',
        param : [
          tracePath(outputBlk.blockId.toString() + 'i1')
        ]
      };
      //console.log('trace res', path);
      tmp.push(path);
    }
    const res : any = {
      'functionName': 'MyCustomFunction',
      'outputs': tmp
    }
    var blob = new Blob([JSON.stringify(res)], {type: "application/json; charset=utf-8"});
    saveAs(blob, "hello world.json");

    database.updateFunction(JSON.stringify(res));
  }, [inputBlocks, outputBlocks, funcBlocks, arrows])

  /**
   * Given the node id the head of an arrow is connected to, backtrace the path and return it
   * @param arrowHead 
   */
  const tracePath = function (arrowHead: string) {
    console.log('arrow head', arrowHead);
    //console.log(arrows);
    let arrow : StartAndEnd = arrows.filter((sae: StartAndEnd) => {
      return sae.end == arrowHead
    })[0]
    const tailBlkId : number = Number(arrow.start.split('o')[0]);
    const tailBlk : blk | undefined = blkMap.get(tailBlkId);
    if (tailBlk == undefined) {
      throw new Error(`Arrow tail does not exist: ${arrow}`);
    }
    if ('inputName' in tailBlk) { // input block
      return {
        'type' : 'input',
        'inputName' : tailBlk.inputName,
        'inputType' : tailBlk.inputType
      }
    } if ('funcName' in tailBlk) { //func block
      const params : any[] = [];
      for (const i of [...Array(tailBlk.paramNames.length).keys()].map(e => e+1)) { //for i in [1, 2, ..., # of params]
        params.push(tracePath(tailBlk.blockId.toString() + 'i' + i.toString()))
      }
      //console.log('params', params);
      return {
        'type' : 'function',
        'paramNames' : tailBlk.paramNames,
        'paramTypes' : tailBlk.paramTypes,
        'outputNames' : tailBlk.outputNames,
        'outputTypes' : tailBlk.outputTypes,
        'params' : params
      }
    } else {
      throw new Error(`Arrow tail is a block of an illegal type: ${arrow}`);
    }
  }

  /**
   * Input block Logics
   */
  const addInputBlock = useCallback((inputName: string, inputType: data_types) => {
    const newId = currBlockId + 1;
    console.log(arrows);
    setCurrBlockId(newId);
    const newBlock : InputBlockDS = {
      blockId: newId,
      inputName: inputName,
      inputType: inputType
    }
    setInputBlocks([...inputBlocks, newBlock]) 
    blkMap.set(newId, newBlock);
    setBlkMap(new Map(blkMap));
  }, [currBlockId, inputBlocks, setCurrBlockId, setInputBlocks])

  const removeInputBlock = useCallback((blkId: number) => {
    setInputBlocks(inputBlocks.filter((blk) => {
      return blk.blockId != blkId
    }));
    blkMap.delete(blkId);
    setBlkMap(new Map<number, blk>(blkMap));
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
    blkMap.set(newId, newBlock);
    setBlkMap(new Map(blkMap));
  }, [currBlockId, outputBlocks, setCurrBlockId, setOutputBlocks])

  const removeOutputBlock = useCallback((blkId: number) => {
    setOutputBlocks(outputBlocks.filter((blk) => {
      return blk.blockId != blkId
    })) ;
    blkMap.delete(blkId);
    setBlkMap(new Map<number, blk>(blkMap));
    console.log(blkMap);
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
    const newBlock : FuncBlockDS = {
      blockId: newId,
      funcId: funcId,
      funcName: f.func_name,
      paramTypes: f.param_types,
      paramNames: f.param_names,
      outputTypes: f.output_types,
      outputNames: f.output_names
    }
    setFuncBlocks([...funcBlocks, newBlock]) 
    blkMap.set(newId, newBlock);
    setBlkMap(new Map(blkMap));
  }, [currBlockId, funcBlocks, setCurrBlockId, setFuncBlocks])

  const removeFuncBlock = useCallback((blkId: number) => {
    setFuncBlocks(funcBlocks.filter((blk: FuncBlockDS) => {
      return blk.blockId != blkId;
    }));
    blkMap.delete(blkId);
    setBlkMap(new Map<number, blk>(blkMap));
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
        <button id='save-custom-function' onClick={() => {saveFunction()}}>Save</button>
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
