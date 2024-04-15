import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { data_types, builtin_function, data_type_enum_name_pairs, allowed_stack_components, custom_function, series } from '../../engine/datatype_def'
import { id_to_builtin_func } from '../../engine/builtin_func_def'
import InputBlock from './InputBlock';
import FuncBlock from './FuncBlock';
import '../../Styles/FuncBuilderBlk.css'
//import '../../lib/font-awesome-4.7.0/css/font-awesome.min.css'
import * as utils from './utils.json'
import OutputBlock from './OutputBlock';
import Xarrow from 'react-xarrows';
import { AuthContext, database } from "../../auth/firebase";
import { FunctionData as CustomFunctionDBRecord } from '../../auth/FirebaseRepository'
import { MyDraggable } from './MyDraggable';

interface InputBlockDS {
  blockId: number
  inputName: string
  inputType: data_types
  inputIdx: number
  val: allowed_stack_components
  blockLocation: [number, number]
}

interface Pair {
  x: number
  y: number
}


export enum FuncType {
  custom = 0,
  builtin = 1
}

interface ioObj {
  name: string,
  value: allowed_stack_components
}

interface ioObj {
  name: string,
  value: allowed_stack_components
}

interface FuncBlockDS {
  blockId: number
  funcType: FuncType
  funcName: string
  funcId: string
  paramTypes: data_types[][]
  paramNames: string[]
  outputTypes: data_types[][]
  outputNames: string[]
  blockLocation: [number, number]
}

interface OutputBlockDS {
  blockId: number
  outputName: string
  outputType: data_types | undefined
  outputIdx: number
  val: any
  blockLocation: [number, number]
}

interface StartAndEnd {
  start: string;
  end: string;
}

const config = utils;


interface Arrow {
  start: string,
  end: string,
  startId: number,
  endId: number,
  startType: blk,
  endType: blk
}

interface FuncBuilderMainProps {
  templateId?: string;
  functionRawJson?: string;
}

type blk = FuncBlockDS | OutputBlockDS | InputBlockDS;

interface ioObj {
  name: string,
  value: allowed_stack_components
}

// interface JSONInput {
//   type: string;
//   inputName: string;
//   inputType: number;
//   inputIdx: number;
//   inputBlkLoc: [number, number];
//   blockId: number;
// }

// interface JSONBuiltinFunction {
//   type: string;
//   useOutput: number;
//   functionName: string;
//   functionId: number;
//   paramNames: string[];
//   paramTypes: number[];
//   outputNames: string[];
//   outputTypes: number[];
//   funcBlkLoc: [number, number];
//   blockId: number;
//   params: JSONInput[];
// }

// interface JSONOutput {
//   type: string;
//   outputName: string;
//   outputType: number;
//   outputIdx: number;
//   outputBlkLoc: [number, number];
//   blockId: number;
//   params: JSONInput[] | JSONBuiltinFunction[] | JSONCustomFunction[];
// }

// interface JSONCustomFunction {
//   functionId: number;
//   type: string;
//   paramNames: string[];
//   paramTypes: number[];
//   outputNames: string[];
//   outputTypes: number[];
//   outputs: JSONOutput[];
// }



function FuncBuilderPreview(props: FuncBuilderMainProps) {

  const allowRenderBlocks = useRef<boolean>(false);
  const hasRenderedBlocks = useRef<boolean>(false);
  const allowUpdateOutputType = useRef<boolean>(false);
  const newArrow = useRef<StartAndEnd | null>(null);

  //const [inputs, setInputs] = useState([0,0])
  //const [result, setResult] = useState(0)
  const [inputBlocks, setInputBlocks] = useState<InputBlockDS[]>([]);
  const [funcBlocks, setFuncBlocks] = useState<FuncBlockDS[]>([]);
  const [outputBlocks, setOutputBlocks] = useState<OutputBlockDS[]>([]);

  // stores the blk ids
  const [currInputBlockId, setCurrInputBlockId] = useState(1000);
  const [currFunctionBlockId, setCurrFunctionBlockId] = useState(3000);
  const [currOutputBlockId, setCurrOutputBlockId] = useState(2000);

  // a map from input idx to the block ds. The index starts at 1.
  const [inputBlkIdxMap, setInputBlkIdxMap] = useState<Map<number, InputBlockDS>>(new Map());
  const [outputBlkIdxMap, setOutputBlkIdxMap] = useState<Map<number, OutputBlockDS>>(new Map());

  const [savedFunction, setSavedFunction] = useState({});
  // const [evalResult, setEvalResult] = useState(new Map<number, ioObj>())

  const [blkMap, setBlkMap] = useState(new Map<number, blk>());

  const [arrows, setArrows] = useState<StartAndEnd[]>([]);
  //const [ arrows, setArrows ] = useState<Arrow[]>([]);

  const [customFunctions, setCustomFunctions] = useState<Map<string, CustomFunctionDBRecord>>(new Map());
  const { currentUser } = useContext(AuthContext);

  // const [addedOutputIds, setAddedOutputIds] = useState<number[]>([]);

  const reloadSavedCustomFunctions = useCallback(() => {
    if (currentUser) {
        database.getFunctionsForUser(currentUser.uid).then(functionsFromDb => {
        const tmp: Map<string, CustomFunctionDBRecord> = new Map();
        functionsFromDb.forEach(functionData => {
          //console.log('functiondata.id', functionData)
          tmp.set(functionData.id, functionData)
        })
        setCustomFunctions(tmp);
        allowRenderBlocks.current = true;
      })
      // setFuncBlocks(funcBlocks => {
      //   for (const funcBlk of funcBlocks) {
      //     if (funcBlk.funcId == props.functionId) {
      //       console.log(funcBlk, props.functionId);
      //       setFuncBlockFunction(funcBlk, props.functionId);
      //     }
      //   }
      //   return [...funcBlocks];
      // })
    }
  }, [currentUser])

  useEffect(() => {
    if (allowRenderBlocks.current && !hasRenderedBlocks.current) {
      hasRenderedBlocks.current = true
      console.log('custom function triggered')
      if (props.functionRawJson) {
        loadBlocksFromJSON(props.functionRawJson)
      }
    }
  }, [customFunctions])

  useEffect(() => {
    if (newArrow.current != null) {
      // If the arrow goes to an output block, we need to set to type of it
      updateOutputBlkType(newArrow.current as StartAndEnd)
      newArrow.current = null
    }
  }, [newArrow.current])

  useEffect(() => {
    reloadSavedCustomFunctions()
  }, [currentUser])

  // function isBuiltinFunction(param: any): param is JSONBuiltinFunction {
  //   return param && param.type === "builtin_function";
  // }

  // function isCustomFunction(param: any): param is JSONCustomFunction {
  //   return param && param.type === "custom_function";
  // }

  // function isCustomFunctionCall(param: any) {
  //   return param && param.type === 'custom_function_call';
  // }

  // function isInput(param: any): param is JSONInput {
  //   return param && param.type === "input";
  // }
  function isBuiltinFunction(param: any) {
    return param && param.type === "builtin_function";
  }

  function isCustomFunction(param: any) {
    return param && param.type === "custom_function";
  }

  function isCustomFunctionCall(param: any) {
    return param && param.type === 'custom_function_call';
  }

  function isInput(param: any) {
    return param && param.type === "input";
  }

    const loadBlocksFromJSON = (rawJSON: string) => {

        const loadParams = async (parentBlockId: number, params: any) => {
            for (let [paramIndex, param] of params.entries()) {
                if (isBuiltinFunction(param)) {
                    //param = param as JSONBuiltinFunction;
                    addFuncBlock(param.functionId, FuncType.builtin, param.funcBlkLoc, param.blockId);
                    addArrow({start: param.blockId + "o" + param.useOutput, end: parentBlockId + "i" + (paramIndex + 1)} as StartAndEnd);
                    loadParams(param.blockId, param.params);
                } else if (isInput(param)) {
                    //param = param as JSONInput;
                    addInputBlock(param.inputName, param.inputType, param.inputBlkLoc, param.blockId, param.inputIdx);
                    addArrow({start: param.blockId + "o1", end: parentBlockId + "i" + (paramIndex + 1)} as StartAndEnd);
                } else if (isCustomFunctionCall(param)) {
                  
                  await addFuncBlock(param.functionId, FuncType.custom, param.blockLocation, param.blockId);
                  addArrow({start: param.blockId + "o" + param.useOutput, end: parentBlockId + "i" + (paramIndex + 1)} as StartAndEnd);
                  loadParams(param.blockId, param.params)
                }
            }
        }

        if (rawJSON === "{}") {
            rawJSON = '{"type":"custom_function","paramNames":[],"paramTypes":[],"outputNames":[],"outputTypes":[],"outputs":[]}';
        }

        //const data: JSONCustomFunction = JSON.parse(rawJSON);
        const data: any = JSON.parse(rawJSON)

        for (const output of data.outputs) {
            // if (!outputBlkIdxMap.has(output.outputIdx)) {
            //     addOutputBlock(output.outputName, output.outputType, output.outputBlkLoc, output.blockId);
            //     loadParams(output.blockId, output.params);
            // }
            addOutputBlock(output.outputName, output.outputType, output.outputBlkLoc, output.blockId);
            loadParams(output.blockId, output.params);
        }

        setSavedFunction(data)

    }

  const addArrow = useCallback((v: StartAndEnd) => {
    console.log("ARROW", v);
    setArrows(oldArrows => [...oldArrows, v]);
    /**
     * tail(start) block  ------>   head(end) block
     */
    newArrow.current = v;
    //allowUpdateOutputType.current = true
  }, [arrows, blkMap]);



  // function arrowStartBlk(arrow: StartAndEnd) {
  //   return Number(arrow.start.split('o')[0]);
  // }

  function arrowEndBlk(arrow: StartAndEnd) {
    return Number(arrow.end.split('i')[0]);
  }

  function isInputBlock(blkId: number) {
    return blkId > 1000 && blkId < 2000;
  }

  function isOutputBlock(blkId: number) {
    return blkId > 2000 && blkId < 3000;
  }

  function isFuncBlock(blkId: number) {
    return blkId > 3000 && blkId < 4000;
  }

  // useEffect(() => {
  //   console.log('input blocks changing', inputBlocks)
  // }, [inputBlocks])

  // Given an arrow leading to an output block
  // Updates the output block's type if needed
  const updateOutputBlkType = (arrow: StartAndEnd) => {
    const endBlkId : number = Number(arrow.end.split('i')[0]);
    if (isOutputBlock(endBlkId)) { //end block is an output block
      const startBlkId : number = Number(arrow.start.split('o')[0]);
      const startNodeIdx : number = Number(arrow.start.split('o')[1]);
      if (isInputBlock(startBlkId)) { //start block is an input block
        const startBlk : InputBlockDS = blkMap.get(startBlkId) as InputBlockDS;
        editOutputBlock(endBlkId, null, startBlk.inputType, null);
      } else if (isFuncBlock(startBlkId)) { //start block is a function block
        const startBlk : FuncBlockDS = blkMap.get(startBlkId) as FuncBlockDS;
        // editOutputBlock(endBlkId, null, startBlk.outputTypes[startNodeIdx - 1], null); // change from 1-based to 0-based indexing
      }
    }
  }

  const editOutputBlock = useCallback(
    (
      blkId: number,
      outputName: string | null,
      outputType: data_types | null,
      idx: number | null
    ) => {
      if (config.debug_mode_FuncBuilder == 1) {
        console.log('edit callback', blkId, outputName, outputType);
        console.log("current output blocks in parents", outputBlocks);
      }

      setOutputBlocks(outputBlocks => {
        return outputBlocks.map((blk: OutputBlockDS) => {
          if (blk.blockId == blkId) {
            if (outputName != null) {
              blk.outputName = outputName;
            }
            if (outputType != null) {
              blk.outputType = outputType;
            }
            if (idx != null) {
              const oldIdx: number = blk.outputIdx;
              blk.outputIdx = idx;
              const blkToSwap: OutputBlockDS | undefined = outputBlkIdxMap.get(idx);
              if (blkToSwap != undefined) {
                blkToSwap.outputIdx = oldIdx;
                outputBlkIdxMap.set(oldIdx, blkToSwap);
              }
              outputBlkIdxMap.set(idx, blk);
            }
          }
          return blk;
        })
      })

      setOutputBlkIdxMap(outputBlkIdxMap => new Map(outputBlkIdxMap));

      if (config.debug_mode_FuncBuilder == 1) {
        console.log('edit output block. Output blk idx map', outputBlkIdxMap);
      }

    }, [outputBlkIdxMap])

  // const updateOutputBlkType = useCallback((arrow: StartAndEnd) => {
  //   const endBlkId: number = Number(arrow.end.split('i')[0]);
  //   if (isOutputBlock(endBlkId)) { //end block is an output block
  //     const startBlkId: number = Number(arrow.start.split('o')[0]);
  //     const startNodeIdx: number = Number(arrow.start.split('o')[1]);
  //     if (isInputBlock(startBlkId)) { //start block is an input block
  //       const startBlk: InputBlockDS = blkMap.get(startBlkId) as InputBlockDS;
  //       editOutputBlock(endBlkId, null, startBlk.inputType, null);
  //     } else if (isFuncBlock(startBlkId)) { //start block is a function block
  //       const startBlk: FuncBlockDS = blkMap.get(startBlkId) as FuncBlockDS;
  //       // editOutputBlock(endBlkId, null, startBlk.outputTypes[startNodeIdx - 1], null); // change from 1-based to 0-based indexing
  //     }
  //   }
  // }, [blkMap])


  /**
   * Input block Logics
   */
  const addInputBlock = useCallback((inputName: string, inputType: data_types, inputBlkLoc: [number, number], blockId?: number, blockIdx?: number) => {
    
    const newBlock: InputBlockDS = {
      blockId: blockId as number,
      inputName: inputName,
      inputType: inputType,
      inputIdx: blockIdx as number,
      val: 0,
      blockLocation: inputBlkLoc
    }

    setInputBlocks(inputBlocks => { console.log('in', newBlock); return [...inputBlocks, newBlock] })

    setBlkMap(blkMap => { blkMap.set(blockId as number, newBlock); return new Map(blkMap) });

    setInputBlkIdxMap(inputBlkIdxMap => { inputBlkIdxMap.set(blockIdx as number, newBlock); return new Map(inputBlkIdxMap) });

    if (config.debug_mode_FuncBuilder == 1) {
      console.log('add input block. inputBlocks', inputBlocks);
      console.log('add input block. block map', blkMap);
      console.log('add input block. inputBlkIdxMap', inputBlkIdxMap);
    }

  }, [inputBlkIdxMap, currInputBlockId])

  /**
   * Output block logics
   */
  const addOutputBlock = useCallback((outputName: string, outputType: data_types, outputBlkLoc: [number, number], blockId?: number) => {
    const newId = blockId ? blockId : currOutputBlockId + 1;
    const newIdx = outputBlkIdxMap.size + 1;
    setCurrOutputBlockId(id => id + 1);

    const newBlock: OutputBlockDS = {
      blockId: newId,
      outputName: outputName,
      outputType: outputType,
      outputIdx: newIdx,
      val: 0,
      blockLocation: outputBlkLoc
    }

    setOutputBlocks(outputBlks => [...outputBlks, newBlock]);

    setBlkMap(blkMap => { blkMap.set(newId, newBlock); return new Map(blkMap) });

    setOutputBlkIdxMap(outputBlkIdxMap => { outputBlkIdxMap.set(newIdx, newBlock); return new Map(outputBlkIdxMap) });

    if (config.debug_mode_FuncBuilder == 1) {
      console.log('Add output block. Output blk idx map', outputBlkIdxMap);
    }

    return newId;
  }, [currOutputBlockId, outputBlkIdxMap])

  /**
   * Function block logics
   */
  //right now this is hard-coded for built-in functions only
  const addFuncBlock = useCallback(async (funcId: string, funcType: FuncType, funcBlkLoc: [number, number], blockId?: number) => {
    const newId = blockId ? blockId : currFunctionBlockId + 1;
    setCurrFunctionBlockId(id => id + 1);

    let f: builtin_function | CustomFunctionDBRecord | undefined = undefined;
    let customFuncBody: any = undefined;
    if (funcType == FuncType.builtin) {
      f = id_to_builtin_func[funcId];
    } else if (funcType == FuncType.custom) {
      f = await database.getFunctionInTemplate(props.templateId as string, funcId)
      try {
        customFuncBody = JSON.parse(f.rawJson);
      } catch(e : any) {
        throw new Error(`Cannot access function ${funcId} in template ${props.templateId}`)
      }
    }

    const isBuiltin = funcType == FuncType.builtin;

    const newBlock: FuncBlockDS = {
      blockId: newId,
      funcType: funcType,
      funcId: funcId,
      funcName: isBuiltin ? (f as builtin_function).func_name : (f as CustomFunctionDBRecord).name,
      paramTypes: isBuiltin ? (f as builtin_function).param_types : customFuncBody.paramTypes,
      paramNames: isBuiltin ? (f as builtin_function).param_names : customFuncBody.paramNames,
      outputTypes: isBuiltin ? (f as builtin_function).output_types : customFuncBody.outputTypes,
      outputNames: isBuiltin ? (f as builtin_function).output_names : customFuncBody.outputNames,
      blockLocation: funcBlkLoc
    }

    setFuncBlocks(funcBlks => [...funcBlks, newBlock])

    setBlkMap(blkMap => { blkMap.set(newId, newBlock); return new Map(blkMap) });
    return newId;

  }, [currFunctionBlockId, customFunctions])

  enum FuncType {
    custom = 0,
    builtin = 1
  }


  /**
   * Updates the fields of blk so that it contains the designated function
   * @param blk blk to update
   * @param funcId new function to designate
   */
  // function setFuncBlockFunction(blk: FuncBlockDS, funcId: string) {
  //   if (Number(funcId) > 100) { // is builtin function
  //     blk.funcId = funcId;
  //     blk.funcType = FuncType.builtin;
  //     const f: builtin_function = id_to_builtin_func[funcId];
  //     blk.funcName = f.func_name;
  //     blk.paramTypes = f.param_types;
  //     blk.paramNames = f.param_names;
  //     blk.outputTypes = f.output_types;
  //     blk.outputNames = f.output_names;
  //   } else { // is custom function
  //     console.log('setting to custom function', blk)
  //     const f: CustomFunctionDBRecord | undefined = customFunctions.get(funcId);
  //     if (f == undefined) {
  //       throw new Error(`Bad custom function id ${funcId}`);
  //     }
  //     const customFuncBody: any = JSON.parse(f.rawJson);
  //     console.log(customFuncBody)
  //     if (customFuncBody.type == undefined) { // the function has not been constructed
  //       // do nothing
  //       blk.funcId = funcId;
  //       blk.funcType = FuncType.custom;
  //       blk.funcName = f.name;
  //       blk.paramTypes = [];
  //       blk.paramNames = [];
  //       blk.outputTypes = [];
  //       blk.outputNames = [];
  //     } else {
  //       blk.funcId = funcId;
  //       blk.funcType = FuncType.custom;
  //       blk.funcName = f.name;
  //       blk.paramTypes = customFuncBody.paramTypes;
  //       blk.paramNames = customFuncBody.paramNames;
  //       blk.outputTypes = customFuncBody.outputTypes;
  //       blk.outputNames = customFuncBody.outputNames;
  //     }

  //   }

  // }
  interface funcInfo {
    id: string;
    name: string;
  }

  // const updateBlockLocation = useCallback(
  //   (blkId: number, left: number, top: number) => {
  //     if (isInputBlock(blkId)) {
  //       for (const blk of inputBlocks) {
  //         if (blk.blockId == blkId) {
  //           blk.blockLocation = [left, top]
  //         }
  //       }
  //       setInputBlocks(blks => [...blks])
  //     } else if (isFuncBlock(blkId)) {
  //       for (const blk of funcBlocks) {
  //         if (blk.blockId == blkId) {
  //           blk.blockLocation = [left, top]
  //         }
  //       }
  //       setFuncBlocks(blks => [...blks])
  //     } else if (isOutputBlock(blkId)) {
  //       for (const blk of outputBlocks) {
  //         if (blk.blockId == blkId) {
  //           blk.blockLocation = [left, top]
  //         }
  //       }
  //       setOutputBlocks(blks => [...blks])
  //     }
  //   }, [inputBlocks, funcBlocks, outputBlocks]
  // )

  const builtinFuncOptions: funcInfo[] = Object.entries(id_to_builtin_func).map(
    ([funcId, funcBody]: [string, builtin_function]) => {
      return { id: funcId, name: funcBody.func_name};
    })

  const customFuncOptions: funcInfo[] = Array.from(customFunctions.values()).map(
    (f: CustomFunctionDBRecord) => {
      return { id: f.id, name: f.name }
    }
  )


  const inputBlocksList = inputBlocks.map((blk: InputBlockDS) => {
    const element = (
      <InputBlock
        blockId={blk.blockId}
        inputName={blk.inputName}
        inputType={blk.inputType}
        inputTypeOptions={data_type_enum_name_pairs}
        inputIdx={[blk.inputIdx, inputBlkIdxMap.size]}
        blockLocation={blk.blockLocation}
        updateBlkCB={() => {}}
        removeBlkCB={() => {}}
        setArrows={() => {}}
        updateBlkLoc={() => {}}
      />
    )
    return (
      <MyDraggable
        key={blk.blockId}
        left={blk.blockLocation[0]}
        top={blk.blockLocation[1]}
        children={element}
        disabled={true}
        updateLocationCB={() => {}}
        id={blk.blockId}
        setArrows={() => {}}
      />
    )
  })


  const funcBlocksList = funcBlocks.map((blk: FuncBlockDS) => {
    const element = (
      <FuncBlock
        key={blk.blockId}
        blockId={blk.blockId}
        funcType={blk.funcType}
        funcId={blk.funcId}
        funcName={blk.funcName}
        funcOptions={blk.funcType == FuncType.builtin ? builtinFuncOptions : customFuncOptions}
        paramTypes={blk.paramTypes}
        paramNames={blk.paramNames}
        outputTypes={blk.outputTypes}
        outputNames={blk.outputNames}
        description={""}
        updateBlkCB={() => {}}
        removeBlkCB={() => {}}
        addArrow={() => {}}
        setArrows={() => {}}
        removeArrow={() => {}}
        displayWarningCB={() => {}}
      />
    )
    return (
      <MyDraggable
        key={blk.blockId}
        left={blk.blockLocation[0]}
        top={blk.blockLocation[1]}
        children={element}
        disabled={true}
        updateLocationCB={() => {}}
        id={blk.blockId}
        setArrows={() => {}}
      />
    );

  })

  const outputBlocksList = outputBlocks.map((blk: OutputBlockDS) => {
    const element = (
      <OutputBlock
        key={blk.blockId}
        blockId={blk.blockId}
        outputName={blk.outputName}
        outputType={blk.outputType}
        outputIdx={[blk.outputIdx, outputBlkIdxMap.size]}
        blockLocation={blk.blockLocation}
        updateBlkCB={() => {}}
        removeBlkCB={() => {}}
        addArrow={() => {}}
        setArrows={() => {}}
        removeArrow={() => {}}
        updateBlkLoc={() => {}}
      />
    )
    return (
      <MyDraggable
        key={blk.blockId}
        left={blk.blockLocation[0]}
        top={blk.blockLocation[1]}
        children={element}
        disabled={true}
        updateLocationCB={() => {}}
        id={blk.blockId}
        setArrows={() => {}}
      />
    )
  })


  return (
    <>
      {/* <Button id='save-custom-function' variant='default' onClick={() => { saveFunction() }}>Save</Button>
      <Button id='eval-custom-function' variant='default' onClick={() => { evaluateFunction() }}>Evaluate</Button> */}
      <h3>Function Preview</h3>
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

export default FuncBuilderPreview;

