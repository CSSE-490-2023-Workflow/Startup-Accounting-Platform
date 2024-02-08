import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import AddBlockButton from './AddBlockButton';
import { data_types, builtin_function, data_type_enum_name_pairs, allowed_stack_components, custom_function, series } from '../../engine/datatype_def'
import { id_to_builtin_func } from '../../engine/builtin_func_def'
import InputBlock from './InputBlock';
import FuncBlock from './FuncBlock';
import '../../Styles/FuncBuilderBlk.css'
import { func_interpreter_new, func_interpreter_new_caller } from '../../engine/engine'
//import '../../lib/font-awesome-4.7.0/css/font-awesome.min.css'
import * as utils from './utils.json'
import OutputBlock from './OutputBlock';
import { saveAs } from 'file-saver';
import Xarrow from 'react-xarrows';
import NumberInput from '../NumberInput';
import { HorizontalGridLines, VerticalBarSeries, XAxis, XYPlot, YAxis } from 'react-vis';
import { AuthContext, database } from "../../auth/firebase";
import { Button } from "@mantine/core";
import { FunctionData as CustomFunctionDBRecord } from '../../auth/FirebaseRepository'
import SeriesInput from '../SeriesInput';
import { MyDraggable } from './MyDraggable';
import {flushSync} from "react-dom";
import { IconTexture } from '@tabler/icons-react';

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

export interface StartAndEnd {
  start: string;
  end: string;
}

const config = utils;


export interface Arrow {
  start: string,
  end: string,
  startId: number,
  endId: number,
  startType: blk,
  endType: blk
}

interface FuncBuilderMainProps {
  functionId: string;
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



function FuncBuilderMain(props: FuncBuilderMainProps) {

  const mounted = useRef<boolean>(false);
  const allowRenderBlocks = useRef<boolean>(false);
  const hasRenderedBlocks = useRef<boolean>(false);

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
  const [evalResult, setEvalResult] = useState(new Map<number, ioObj>())

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
      setFuncBlocks(funcBlocks => {
        for (const funcBlk of funcBlocks) {
          if (funcBlk.funcId == props.functionId) {
            console.log(funcBlk, props.functionId);
            setFuncBlockFunction(funcBlk, props.functionId);
          }
        }
        return [...funcBlocks];
      })
    }
  }, [currentUser])

  useEffect(() => {
    if (allowRenderBlocks.current && allowRenderBlocks && !hasRenderedBlocks.current) {
      hasRenderedBlocks.current = true
      console.log('custom function triggered')
      if (props.functionRawJson) {
        loadBlocksFromJSON(props.functionRawJson)
      }
    }
  }, [customFunctions])

  useEffect(() => {
    reloadSavedCustomFunctions()
  }, [currentUser])
  
  // re-render arrows
  const refreshArrows = useCallback(() => {
    setArrows(arrows => arrows.filter(arrow => {
      const start : string = arrow.start
      const end : string = arrow.end
      console.log('rerender arrow')
      console.log(arrow)
      if (document.getElementById(start) == null || 
        document.getElementById(end) == null){
        console.log('is null')
        return false
      }
      return true
    }))
  }, [blkMap])
  

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

        const loadParams = (parentBlockId: number, params: any) => {
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
                  addFuncBlock(param.functionId, FuncType.custom, param.blockLocation, param.blockId);
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

  // const testLoadFunctions = useCallback(() => {
  //   if (currentUser) {
  //     database.subscribeToFunctionsForUser(currentUser.uid, functionsFromDb => {
  //       let currFunc: CustomFunctionDBRecord;
  //       let json: string = '{"type":"custom_function","paramNames":[],"paramTypes":[],"outputNames":[],"outputTypes":[],"outputs":[]}';
  //       functionsFromDb.forEach(functionData => {
  //         if (functionData.id == props.functionId) {
  //           currFunc = functionData;
  //           json = currFunc.rawJson;
  //           if (json === "{}") {
  //             json = '{"type":"custom_function","paramNames":[],"paramTypes":[],"outputNames":[],"outputTypes":[],"outputs":[]}';
  //           }
  //
  //           const data: JSONCustomFunction = (JSON.parse(json));
  //           console.log("json", json);
  //           const outputs: JSONOutput[] = data.outputs;
  //           for (const output of outputs) {
  //             // console.log("ids", addedOutputIds);
  //             if (!outputBlkIdxMap.has(output.outputIdx)) {
  //               // setAddedOutputIds([...addedOutputIds, output.outputIdx]);
  //               console.log("output blockidx",output.outputIdx);
  //               addOutputBlock(output.outputName, output.outputType, output.outputBlkLoc, output.blockId);
  //
  //               const params = output.params;
  //
  //               for (let [paramIdx, param] of params.entries()) {
  //                 if (isBuiltinFunction(param)) {
  //                   console.log(param);
  //
  //                   addFuncBlock((param.functionId).toString(), param.type == "builtin_function" ? 1 : 0, param.funcBlkLoc);
  //
  //                   for (const [inputBlockIdx, input] of (param as JSONBuiltinFunction).params.entries()) {
  //                     console.log(input.inputName);
  //
  //                     flushSync(() => {
  //                         addInputBlock(input.inputName, input.inputType, input.inputBlkLoc, input.blockId);
  //                     })
  //
  //                     addArrow({start: input.blockId + "o1", end: param.blockId + "i" + (inputBlockIdx + 1)} as StartAndEnd)
  //
  //                   }
  //
  //                   addArrow({start: param.blockId + "o1", end: output.blockId + "i" + (paramIdx + 1)} as StartAndEnd)
  //
  //                 } else if (isCustomFunction(param)) {
  //
  //                 } else if (isInput(param)) {
  //
  //                 }
  //
  //               }
  //             }
  //
  //           }
  //         }
  //       })
  //     });
  //   }
  // }, [currentUser, inputBlkIdxMap, outputBlkIdxMap])


  const addArrow = useCallback((v: StartAndEnd) => {
    console.log("ARROW", v);
    setArrows(oldArrows => [...oldArrows, v]);
    /**
     * tail(start) block  ------>   head(end) block
     */

    // If the arrow goes to an output block, we need to set to type of it
    updateOutputBlkType(v);
  }, [arrows, blkMap]);


  const removeArrowsAttachedToBlk = useCallback((blkId: number) => {
    setArrows(arrows => arrows.filter((a: StartAndEnd) => {
      return Number(a.start.split('o')[0]) != blkId && Number(a.end.split('i')[0]) != blkId
    }));
  }, [arrows])

  const removeArrow = useCallback((v: string[]) => {
    const newArrows: StartAndEnd[] = []
    console.log(arrows);
    for (let i = 0; i < arrows.length; i++) {
      let toRemove: boolean = false;
      for (let j = 0; j < v.length; j++) {
        if (arrows[i].end === v[j])
          toRemove = true;
      }
      if (!toRemove)
        newArrows.push(arrows[i]);
    }
    console.log(newArrows);
    setArrows(newArrows);

  }, [arrows])

  function arrowStartBlk(arrow: StartAndEnd) {
    return Number(arrow.start.split('o')[0]);
  }

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
  // function updateOutputBlkType(arrow: StartAndEnd) {
  //   const endBlkId : number = Number(arrow.end.split('i')[0]);
  //   if (isOutputBlock(endBlkId)) { //end block is an output block
  //     const startBlkId : number = Number(arrow.start.split('o')[0]);
  //     const startNodeIdx : number = Number(arrow.start.split('o')[1]);
  //     if (isInputBlock(startBlkId)) { //start block is an input block
  //       const startBlk : InputBlockDS = blkMap.get(startBlkId) as InputBlockDS;
  //       editOutputBlock(endBlkId, null, startBlk.inputType, null);
  //     } else if (isFuncBlock(startBlkId)) { //start block is a function block
  //       const startBlk : FuncBlockDS = blkMap.get(startBlkId) as FuncBlockDS;
  //       editOutputBlock(endBlkId, null, startBlk.outputTypes[startNodeIdx - 1], null); // change from 1-based to 0-based indexing
  //     }
  //   }

  // }

  const updateOutputBlkType = useCallback((arrow: StartAndEnd) => {
    const endBlkId: number = Number(arrow.end.split('i')[0]);
    if (isOutputBlock(endBlkId)) { //end block is an output block
      const startBlkId: number = Number(arrow.start.split('o')[0]);
      const startNodeIdx: number = Number(arrow.start.split('o')[1]);
      if (isInputBlock(startBlkId)) { //start block is an input block
        const startBlk: InputBlockDS = blkMap.get(startBlkId) as InputBlockDS;
        editOutputBlock(endBlkId, null, startBlk.inputType, null);
      } else if (isFuncBlock(startBlkId)) { //start block is a function block
        const startBlk: FuncBlockDS = blkMap.get(startBlkId) as FuncBlockDS;
        // editOutputBlock(endBlkId, null, startBlk.outputTypes[startNodeIdx - 1], null); // change from 1-based to 0-based indexing
      }
    }
  }, [blkMap])


  const [outputStore, setOutputStore] = useState<Map<number, ioObj>[]>([])
  const evaluateFunction = useCallback(() => {
    const paramMap: Map<number, ioObj> = new Map<number, ioObj>();
    for (let inputBlk of inputBlocks) {
      paramMap.set(inputBlk.inputIdx, { name: inputBlk.inputName, value: inputBlk.val });
    }
    console.log(`starting evaluation`)
    for (const [i, v] of paramMap.entries()) {
      console.log('param:', i, v.value)
    }
    console.log(savedFunction)
    const res: Map<number, ioObj> = func_interpreter_new(JSON.stringify(savedFunction), paramMap)
    //setOutputMap(res);
    console.log('Evaluation completed. Outputs of the custom function are: ', res);
    setEvalResult(new Map(res));
    setOutputStore([res]);
    console.log('complete. Outputs of the custom function are: ', res);
  }, [inputBlocks, outputBlocks, funcBlocks, arrows, savedFunction]);

  const saveFunction = useCallback(() => {
    console.log('saving')
    const tmp: any[] = [];

    //back trace each output block
    for (const outputBlk of outputBlocks) {
      console.log("loc: ", outputBlk.blockLocation);
      let path: any = {
        type: 'output',
        outputName: outputBlk.outputName,
        outputType: outputBlk.outputType,
        outputIdx: outputBlk.outputIdx,
        outputBlkLoc: outputBlk.blockLocation,
        blockId: outputBlk.blockId,
        params: [
          tracePath(outputBlk.blockId.toString() + 'i1')
        ]
      };
      //console.log('trace res', path);
      tmp.push(path);
    }

    //sort input / output blocks by indices

    const inputBlksSorted: InputBlockDS[] = inputBlocks.sort((blk1, blk2) =>
      blk1.inputIdx - blk2.inputIdx
    )

    const outputBlksSorted: OutputBlockDS[] = outputBlocks.sort((blk1, blk2) =>
      blk1.outputIdx - blk2.outputIdx
    )

    const res: any = {
      type: 'custom_function',
      useOutput: 'all',
      paramNames: inputBlksSorted.map(iBlk => iBlk.inputName),
      paramTypes: inputBlksSorted.map(iBlk => iBlk.inputType),
      outputNames: outputBlksSorted.map(oBlk => oBlk.outputName),
      outputTypes: outputBlksSorted.map(oBlk => oBlk.outputType),
      outputs: tmp
    }


    var blob = new Blob([JSON.stringify(res)], { type: "application/json; charset=utf-8" });
    saveAs(blob, "hello world.json");
    setSavedFunction(res);
    console.log('saved func', res);

    database.updateFunction(props.functionId, { rawJson: JSON.stringify(res) });
    reloadSavedCustomFunctions();
  }, [inputBlocks, outputBlocks, funcBlocks, arrows, props.functionId])
  /**
   * Given the node id the head of an arrow is connected to, backtrace the path and return it
   * @param arrowHead
   */
  const tracePath = function (arrowHead: string) {
    console.log('arrow head', arrowHead);
    //console.log(arrows);
    let arrow: StartAndEnd = arrows.filter((sae: StartAndEnd) => {
      return sae.end == arrowHead
    })[0]
    const tailBlkId: number = Number(arrow.start.split('o')[0]);
    const tailBlk: blk | undefined = blkMap.get(tailBlkId);
    console.log('blkMap', blkMap);

    /**
     * tail block  ------>   head block
     */
    // which output of the tail block to use
    const tailBlkOutputIdx: number | undefined = Number(arrow.start.split('o')[1]);

    if (tailBlk == undefined) {
      throw new Error(`Arrow tail does not exist: ${arrow.start} to ${arrow.end}`);
    }
    if ('inputName' in tailBlk) { // input block
      return {
        type: 'input',
        inputName: tailBlk.inputName,
        inputType: tailBlk.inputType,
        inputIdx: tailBlk.inputIdx,
        inputBlkLoc: tailBlk.blockLocation,
        blockId: tailBlk.blockId
      }
    } if ('funcType' in tailBlk) { //func block
      const params: any[] = [];
      for (const i of [...Array(tailBlk.paramNames.length).keys()].map(e => e + 1)) { //for i in [1, 2, ..., # of params]
        params.push(tracePath(tailBlk.blockId.toString() + 'i' + i.toString()))
      }
      //console.log('params', params);
      if (tailBlk.funcType == FuncType.builtin) {
        return {
          type: 'builtin_function',
          useOutput: tailBlkOutputIdx,
          functionName: tailBlk.funcName,
          functionId: tailBlk.funcId,
          paramNames: tailBlk.paramNames,
          paramTypes: tailBlk.paramTypes,
          outputNames: tailBlk.outputNames,
          outputTypes: tailBlk.outputTypes,
          funcBlkLoc: tailBlk.blockLocation,
          blockId: tailBlk.blockId,
          params: params
        }
      } else { // custom
        if (customFunctions.get(tailBlk.funcId) == undefined) {
          throw new Error(`Custom function cannot be found ${tailBlk.funcId}`)
        } else {
          return {
            type: 'custom_function_call',
            functionId: tailBlk.funcId,
            useOutput: tailBlkOutputIdx,
            paramNames: tailBlk.paramNames,
            paramTypes: tailBlk.paramTypes,
            blockLocation: tailBlk.blockLocation,
            blockId: tailBlk.blockId,
            params: params,
            body: (customFunctions.get(tailBlk.funcId) as CustomFunctionDBRecord).rawJson
          }
        }
      }
    } else {
      throw new Error(`Arrow tail is a block of an illegal type: ${arrow.start} ${arrow.end}`);
    }
  }

  /**
   * Input block Logics
   */
  const addInputBlock = useCallback((inputName: string, inputType: data_types, inputBlkLoc: [number, number], blockId?: number, blockIdx?: number) => {
    const newId = blockId ? blockId : currInputBlockId + 1;
    const newIdx = blockIdx ? blockIdx : inputBlkIdxMap.size + 1;
    console.log("index", inputBlkIdxMap);
    console.log("ID", currInputBlockId);
    setCurrInputBlockId(id => id + 1);
    const newBlock: InputBlockDS = {
      blockId: newId,
      inputName: inputName,
      inputType: inputType,
      inputIdx: newIdx,
      val: 0,
      blockLocation: inputBlkLoc
    }

    setInputBlocks(inputBlocks => { console.log('in', newBlock); return [...inputBlocks, newBlock] })

    setBlkMap(blkMap => { blkMap.set(newId, newBlock); return new Map(blkMap) });

    setInputBlkIdxMap(inputBlkIdxMap => { inputBlkIdxMap.set(newIdx, newBlock); return new Map(inputBlkIdxMap) });

    if (config.debug_mode_FuncBuilder == 1) {
      console.log('add input block. inputBlocks', inputBlocks);
      console.log('add input block. block map', blkMap);
      console.log('add input block. inputBlkIdxMap', inputBlkIdxMap);
    }

    return newId;
  }, [inputBlkIdxMap, currInputBlockId])

  const removeInputBlock = useCallback((blkId: number) => {
    console.log('removing', blkId)

    setInputBlocks(inputBlocks => {
      return inputBlocks.filter((blk) => blk.blockId != blkId)
    });

    setBlkMap(blkMap => { blkMap.delete(blkId); return new Map(blkMap)});
    //console.log('blkmap after removal input block', blkMap);

    // Make all blks with larger indices than the removed blk index--
    
    inputBlkIdxMap.delete(inputBlkIdxMap.size);
    setInputBlkIdxMap(inputBlkIdxMap => {
      let flag: boolean = false;
      for (const [blkIdx, blk] of inputBlkIdxMap) {
        if (flag) {
          //console.log('setting', blkIdx - 1, blk);
          inputBlkIdxMap.set(blkIdx - 1, blk);
          blk.inputIdx = blk.inputIdx - 1;
        }
        if (blk.blockId == blkId) {
          flag = true;
        }
      }
      return new Map(inputBlkIdxMap)
    });

    removeArrowsAttachedToBlk(blkId);

    if (config.debug_mode_FuncBuilder == 1) {
      console.log('remove intput block. inputBlocks', inputBlocks);
      console.log('remove intput block. block map', blkMap);
      console.log('remove intput block. inputBlkIdxMap', inputBlkIdxMap);
    }

  }, [inputBlkIdxMap])

  // Updates the information of the block with the given id
  // params that are passed in null will NOT be updated
  const editInputBlock = useCallback(
    (
      blkId: number,
      inputName: string | null,
      inputType: data_types | null,
      idx: number | null
    ) => {
      if (config.debug_mode_FuncBuilder == 1) {
        console.log('edit callback', blkId, inputName, inputType);
        console.log("current input blocks in parents", inputBlocks);
      }

      setInputBlocks(inputBlocks => {
        return inputBlocks.map((blk: InputBlockDS) => {
          if (blk.blockId == blkId) {
            if (inputName != null) {
              blk.inputName = inputName;
            }
            if (inputType != null) {
              blk.inputType = inputType;
              if (inputType == data_types.dt_series) {
                const temp = [];
                for (let i = 0; i < INVALUECAP; i++) {
                  temp.push(0)
                }
                blk.val = temp;
              }
              // we need to update all outputs connected to the block
              for (const arrow of arrows) {
                if (arrowStartBlk(arrow) == blkId && isOutputBlock(arrowEndBlk(arrow))) {
                  updateOutputBlkType(arrow);
                }
              }
            }
            if (idx != null) {
              const oldIdx: number = blk.inputIdx;
              blk.inputIdx = idx;
              const blkToSwap: InputBlockDS | undefined = inputBlkIdxMap.get(idx);
              if (blkToSwap != undefined) {
                blkToSwap.inputIdx = oldIdx;
                inputBlkIdxMap.set(oldIdx, blkToSwap);
              }
              inputBlkIdxMap.set(idx, blk);
            }
          }
          return blk;
        })
      })

      setInputBlkIdxMap(inputBlkIdxMap => new Map(inputBlkIdxMap));

      if (config.debug_mode_FuncBuilder == 1) {
        console.log('edit input block. Input blk idx map', inputBlkIdxMap);
      }

    }, [inputBlkIdxMap])

  const updateInputBlkLoc = useCallback(
    (blkId: number, newLocation: [number, number]) => {

      console.log("block location in func builder: ", newLocation);

      // Map over the outputBlocks array and update the specified block's location
      const updatedBlocks: InputBlockDS[] = inputBlocks.map((blk: InputBlockDS) => {
        if (blk.blockId === blkId) {
          // Update the block's location
          blk.blockLocation = newLocation;
        }
        return blk;
      });

      // Update the state with the modified outputBlocks array
      setInputBlocks(updatedBlocks);
    },
    [inputBlocks] // Include dependencies if needed
  );

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

  const removeOutputBlock = useCallback((blkId: number) => {

    setOutputBlocks(outputBlks => outputBlks.filter((blk) => {
      return blk.blockId != blkId
    }));

    setBlkMap(blkMap => { blkMap.delete(blkId); return new Map<number, blk>(blkMap) });
    // Make all blks with larger indices than the removed blk index--
    setOutputBlkIdxMap(outputBlkIdxMap => {
      let flag: boolean = false;
      for (const [blkIdx, blk] of outputBlkIdxMap) {
        if (flag) {
          outputBlkIdxMap.set(blkIdx - 1, blk);
          blk.outputIdx = blk.outputIdx - 1;
        }
        if (blk.blockId == blkId) {
          flag = true;
        }
      }
      outputBlkIdxMap.delete(outputBlkIdxMap.size);
      return new Map(outputBlkIdxMap)
    });

    removeArrowsAttachedToBlk(blkId);

    if (config.debug_mode_FuncBuilder == 1) {
      console.log('remove output block. Output blk idx map', outputBlkIdxMap);
    }

  }, [outputBlkIdxMap])

  // Updates the information of the block with the given id
  // params that are null will NOT be updated
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

  const updateOutputBlkLoc = useCallback(
    (blkId: number, newLocation: [number, number]) => {

      console.log("output block location in func builder: ", newLocation);

      // Map over the outputBlocks array and update the specified block's location
      const updatedBlocks: OutputBlockDS[] = outputBlocks.map((blk: OutputBlockDS) => {
        if (blk.blockId === blkId) {
          // Update the block's location
          blk.blockLocation = newLocation;
        }
        return blk;
      });

      // Update the state with the modified outputBlocks array
      setOutputBlocks(updatedBlocks);
    },
    [outputBlocks] // Include dependencies if needed
  );


  /**
   * Function block logics
   */
  //right now this is hard-coded for built-in functions only
  const addFuncBlock = useCallback((funcId: string, funcType: FuncType, funcBlkLoc: [number, number], blockId?: number) => {
    const newId = blockId ? blockId : currFunctionBlockId + 1;
    setCurrFunctionBlockId(id => id + 1);

    let f: builtin_function | CustomFunctionDBRecord | undefined = undefined;
    let customFuncBody: any = undefined;
    if (funcType == FuncType.builtin) {
      f = id_to_builtin_func[funcId];
    } else if (funcType == FuncType.custom) {
      f = customFunctions.get(funcId);
      if (f == undefined) {
        throw new Error(`Creating Function Block: Bad function id ${funcId}`)
      }
      customFuncBody = JSON.parse(f.rawJson);
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

  const removeFuncBlock = useCallback((blkId: number) => {

    setFuncBlocks(funcBlocks => 
      funcBlocks.filter((blk: FuncBlockDS) => {
        return blk.blockId != blkId;
      })
    );

    setBlkMap(blkMap => { blkMap.delete(blkId); return new Map<number, blk>(blkMap)});

    removeArrowsAttachedToBlk(blkId);

  }, [removeArrowsAttachedToBlk])


  enum FuncType {
    custom = 0,
    builtin = 1
  }


  /**
   * Updates the fields of blk so that it contains the designated function
   * @param blk blk to update
   * @param funcId new function to designate
   */
  function setFuncBlockFunction(blk: FuncBlockDS, funcId: string) {
    if (Number(funcId) > 100) { // is builtin function
      blk.funcId = funcId;
      blk.funcType = FuncType.builtin;
      const f: builtin_function = id_to_builtin_func[funcId];
      blk.funcName = f.func_name;
      blk.paramTypes = f.param_types;
      blk.paramNames = f.param_names;
      blk.outputTypes = f.output_types;
      blk.outputNames = f.output_names;
    } else { // is custom function
      console.log('setting to custom function', blk)
      const f: CustomFunctionDBRecord | undefined = customFunctions.get(funcId);
      if (f == undefined) {
        throw new Error(`Bad custom function id ${funcId}`);
      }
      const customFuncBody: any = JSON.parse(f.rawJson);
      console.log(customFuncBody)
      if (customFuncBody.type == undefined) { // the function has not been constructed
        // do nothing
        blk.funcId = funcId;
        blk.funcType = FuncType.custom;
        blk.funcName = f.name;
        blk.paramTypes = [];
        blk.paramNames = [];
        blk.outputTypes = [];
        blk.outputNames = [];
      } else {
        blk.funcId = funcId;
        blk.funcType = FuncType.custom;
        blk.funcName = f.name;
        blk.paramTypes = customFuncBody.paramTypes;
        blk.paramNames = customFuncBody.paramNames;
        blk.outputTypes = customFuncBody.outputTypes;
        blk.outputNames = customFuncBody.outputNames;
      }

    }

  }
  const editFuncBlock = useCallback((
    blkId: number,
    funcType: FuncType | null,
    funcId: string | null
  ) => {
    if (config.debug_mode_FuncBuilder == 1) {
      console.log('edit func block callback', blkId, funcId);
      console.log("current function blocks in parents", funcBlocks);
    }

    const tmp: FuncBlockDS[] = funcBlocks.map((blk: FuncBlockDS) => {
      if (blk.blockId == blkId) {
        if (funcType == null && funcId != null) { // change to another function of the same type
          setFuncBlockFunction(blk, funcId);
        } else if (funcType != null && funcId == null) { //change function type
          if (funcType == FuncType.builtin) {
            setFuncBlockFunction(blk, '101'); //default to 101 (add)
          } else if (funcType == FuncType.custom) {
            console.log(customFunctions);
            const f: CustomFunctionDBRecord = customFunctions.values().next().value;
            setFuncBlockFunction(blk, f.id);
          }
        }

        for (const arrow of arrows) {
          if (arrowStartBlk(arrow) == blkId && isOutputBlock(arrowEndBlk(arrow))) {
            updateOutputBlkType(arrow);
          }
        }
      }

      //setArrows(arrows => [...arrows]);
      return blk;
    })

    setFuncBlocks(funcBlocks => 
      funcBlocks.map((blk: FuncBlockDS) => {
        if (blk.blockId == blkId) {
          if (funcType == null && funcId != null) { // change to another function of the same type
            setFuncBlockFunction(blk, funcId);
          } else if (funcType != null && funcId == null) { //change function type
            if (funcType == FuncType.builtin) {
              setFuncBlockFunction(blk, '101'); //default to 101 (add)
            } else if (funcType == FuncType.custom) {
              console.log(customFunctions);
              const f: CustomFunctionDBRecord = customFunctions.values().next().value;
              setFuncBlockFunction(blk, f.id);
            }
          }
  
          for (const arrow of arrows) {
            if (arrowStartBlk(arrow) == blkId && isOutputBlock(arrowEndBlk(arrow))) {
              updateOutputBlkType(arrow);
            }
          }
        }
        removeArrowsAttachedToBlk(blk.blockId)
        return blk;
      })
    )

  }, [funcBlocks, arrows, customFunctions])

  const updateFuncBlkLoc = useCallback(
    (blkId: number, newLocation: [number, number]) => {

      console.log("func block location in func builder: ", newLocation);

      // Map over the outputBlocks array and update the specified block's location
      const updatedBlocks: FuncBlockDS[] = funcBlocks.map((blk: FuncBlockDS) => {
        if (blk.blockId === blkId) {
          // Update the block's location
          blk.blockLocation = newLocation;
        }
        return blk;
      });

      // Update the state with the modified outputBlocks array
      setFuncBlocks(updatedBlocks);
    },
    [funcBlocks] // Include dependencies if needed
  );

  interface funcInfo {
    id: string;
    name: string;
  }

  const updateBlockLocation = useCallback(
    (blkId: number, left: number, top: number) => {
      if (isInputBlock(blkId)) {
        for (const blk of inputBlocks) {
          if (blk.blockId == blkId) {
            blk.blockLocation = [left, top]
          }
        }
        setInputBlocks(blks => [...blks])
      } else if (isFuncBlock(blkId)) {
        for (const blk of funcBlocks) {
          if (blk.blockId == blkId) {
            blk.blockLocation = [left, top]
          }
        }
        setFuncBlocks(blks => [...blks])
      } else if (isOutputBlock(blkId)) {
        for (const blk of outputBlocks) {
          if (blk.blockId == blkId) {
            blk.blockLocation = [left, top]
          }
        }
        setOutputBlocks(blks => [...blks])
      }
    }, [inputBlocks, funcBlocks, outputBlocks]
  )

  const builtinFuncOptions: funcInfo[] = Object.entries(id_to_builtin_func).map(
    ([funcId, funcBody]: [string, builtin_function]) => {
      return { id: funcId, name: funcBody.func_name };
    })

  const customFuncOptions: funcInfo[] = Array.from(customFunctions.values()).map(
    (f: CustomFunctionDBRecord) => {
      return { id: f.id, name: f.name }
    }
  )

  const changeInput = useCallback((inputId: number, newValue: allowed_stack_components) => {
    console.log('in changeInput, blks are ', inputBlocks, newValue);
    const tmp: InputBlockDS[] = inputBlocks.map((blk: InputBlockDS, index: number) => {
      console.log('in changeInput', index, blk, newValue);
      if (blk.blockId == inputId + 1000) {
        blk.val = newValue;
      }
      console.log(blk.val);
      return blk;
    })
    setInputBlocks(inputBlocks => [...inputBlocks]);
    console.log('tmp', inputBlocks);
  }, [inputBlocks, setInputBlocks])


  // let inputListCount: number = 0;
  // const [inputStore, setInputStore] = useState<data_types[]>([]);
  const INVALUECAP = 20;
  const [fullInputBlocks, setFullInputBlocks] = useState<React.JSX.Element[]>([]);
  useEffect(() => {
    console.log("also called");
    setFullInputBlocks(inputBlocks.map((blk: InputBlockDS) => {
      //   inputListCount += 1
      //   if(inputStore.length < inputListCount) {
      //     setInputStore((inputStore) => [...inputStore, 0])
      //   }
      console.log("called", inputBlocks);
      if (blk.inputType === data_types.dt_series) {
        // const temp = []
        // for(let i = 0; i < INVALUECAP; i++) {
        //   temp.push(0)
        // }
        console.log(blk.val);
        return (
          <>
            <h3>{blk.inputName}</h3>
            <SeriesInput handleStateChange={changeInput} ind={blk.inputIdx} inValues={blk.val as series} inputValueCap={INVALUECAP} />
          </>
        );
      }

      return (
        <>
          <h3>{blk.inputName}</h3>
          <NumberInput handleStateChange={changeInput} ind={blk.inputIdx} inValue={0} inputId={blk.blockId} />
        </>
      );
    }))
  }, [inputBlocks])




  let outputListCount: number = 0;
  const outputList: any[] = [];
  for (const [outputIdx, outputObj] of evalResult) {
    let data = [{
      x: 0,
      y: outputObj.value as number
    }]
    if ((typeof outputObj.value) !== "number") {
      data = []
      for (let i = 0; i < (outputObj.value as series).length; i++) {
        data.push({ x: i, y: (outputObj.value as series)[i] as number })
      }
    }
    console.log(data)
    outputList.push(
      (
        <>
          <h3>{outputObj.name}</h3>
          <XYPlot
            width={200}
            height={200}
            xDomain={[0, 5.5]}
            yDomain={[0, 20]}
          >
            <HorizontalGridLines />
            <VerticalBarSeries data={data} barWidth={0.2} />
            <XAxis />
            <YAxis />

          </XYPlot>
        </>
      )
    )
  }

  // const outputList = Object.entries(evalResult).map(([outputIdx, outputObj]) => {
  //   console.log(outputIdx, outputObj)
  //   outputListCount += 1

  //   return (
  //     <>
  //       <h3>{outputObj.name}</h3>
  //       <XYPlot
  //           width={200}
  //           height={200}
  //           xDomain={[0,5.5]}
  //           yDomain={[0,20]}
  //       >
  //           <HorizontalGridLines />
  //           <VerticalBarSeries data={data} barWidth={0}/>
  //           <XAxis />
  //           <YAxis />

  //         </XYPlot>
  //     </>
  //   );
  // })

  const inputBlocksList = inputBlocks.map((blk: InputBlockDS) => {
    const element = (
      <InputBlock
        blockId={blk.blockId}
        inputName={blk.inputName}
        inputType={blk.inputType}
        inputTypeOptions={data_type_enum_name_pairs}
        inputIdx={[blk.inputIdx, inputBlkIdxMap.size]}
        blockLocation={blk.blockLocation}
        updateBlkCB={editInputBlock}
        removeBlkCB={removeInputBlock}
        setArrows={setArrows}
        updateBlkLoc={updateInputBlkLoc}
      />
    )
    return (
      <MyDraggable
        key={blk.blockId}
        left={blk.blockLocation[0]}
        top={blk.blockLocation[1]}
        children={element}
        disabled={false}
        updateLocationCB={updateBlockLocation}
        id={blk.blockId}
        setArrows={setArrows}
      />
    )
  })

  //   const outputList = outputBlocks.map((blk: OutputBlockDS) => {
  //     outputListCount += 1
  //     let data: Pair[] = []
  //     //console.log(outputStore.length);
  //     if(outputStore.length > 0 && outputStore[0] != undefined) {
  //       data = [{x: 0, y: outputStore[0].get(blk.blockId - 2000)?.value as number}]
  //       console.log(blk.blockId);
  //       console.log(outputStore[0].get(1));
  //     }
  //     // if(outputStore.length < outputListCount)
  //     //   setOutputStore([...outputStore, ])
  //     return (
  //       <>
  //         <h3>{blk.outputName}</h3>
  //         <XYPlot
  //             width={200}
  //             height={200}
  //             xDomain={[0,5.5]}
  //             yDomain={[0,20]}>
  //             <HorizontalGridLines />
  //             <VerticalBarSeries
  //               data={data}
  //               barWidth={0.2} />
  //             {/*Qingyuan needs to generate the data and place it in here as the comment has it
  //               // data={op[0].map(([index, value], k) => (
  //               //   {x: index, y: value}
  //     // ))} barWidth={0.2} />*/}
  //             <XAxis />
  //             <YAxis />
  //           </XYPlot>
  //       </>
  //     );
  //   })

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
        blockLocation={blk.blockLocation}
        updateBlkLoc={updateFuncBlkLoc}
        updateBlkCB={editFuncBlock}
        removeBlkCB={removeFuncBlock}
        addArrow={addArrow}
        setArrows={setArrows}
        removeArrow={removeArrow}
      />
    )
    return (
      <MyDraggable
        key={blk.blockId}
        left={blk.blockLocation[0]}
        top={blk.blockLocation[1]}
        children={element}
        disabled={false}
        updateLocationCB={updateBlockLocation}
        id={blk.blockId}
        setArrows={setArrows}
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
        updateBlkCB={editOutputBlock}
        removeBlkCB={removeOutputBlock}
        addArrow={addArrow}
        setArrows={setArrows}
        removeArrow={removeArrow}
        updateBlkLoc={updateOutputBlkLoc}
      />
    )
    return (
      <MyDraggable
        key={blk.blockId}
        left={blk.blockLocation[0]}
        top={blk.blockLocation[1]}
        children={element}
        disabled={false}
        updateLocationCB={updateBlockLocation}
        id={blk.blockId}
        setArrows={setArrows}
      />
    )
  })


  return (
    <>
      <AddBlockButton onClick={addInputBlock} buttonText="Add Input Block"
        defaultAttr={["new input", data_types.dt_number, [200,200]]} />
      <AddBlockButton onClick={addFuncBlock} buttonText="Add Function Block" defaultAttr={['101', FuncType.builtin, [200,200]]} />
      <AddBlockButton onClick={addOutputBlock} buttonText="Add Output Block" defaultAttr={["new output", undefined, [200,200]]} />
      <Button id='save-custom-function' variant='default' onClick={() => { saveFunction() }}>Save</Button>
      <Button id='eval-custom-function' variant='default' onClick={() => { evaluateFunction() }}>Evaluate</Button>
      <h3>Function Builder</h3>
      <div style={{ display: "flex" }}>
        {fullInputBlocks}
      </div>
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
      {outputList}
    </>
  );
}

export default FuncBuilderMain;

