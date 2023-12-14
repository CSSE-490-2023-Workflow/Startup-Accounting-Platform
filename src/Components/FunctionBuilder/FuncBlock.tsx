import React, { ChangeEvent, useCallback, useState} from 'react';
import { id_to_builtin_func } from '../../engine/builtin_func_def'

function FuncBlock(props: any) {
  const [ blkId, funcId, funcName, funcOptions, editCB, removeCB ] = [props.blockId, props.funcId, props.funcName, props.funcOptions, props.updateBlkCB, props.removeBlkCB]

  const [func, setFunc] = useState(funcId);

  function handleFuncChange(e: any) {
    setFunc(e.target.value);
    editCB(blkId, e.target.value);
  }

  const func_options = funcOptions.map(([id, func_name] : [number, string]) => (
    <option value={id}>{func_name}</option>
  ))

  function handleRemoveBlock(e: any) {
    removeCB(blkId);
  }

  return (
    <div className="func-block func-builder-block">
      <div className="func-block-id">{blkId}</div>
      <button className='block-remove' onClick={handleRemoveBlock}>Remove Block</button>
      <div className="func-block-title">{funcName}</div>
      <select className="func-block-func-select" value={funcId} onChange={handleFuncChange}>
        {func_options}
      </select>
      <div className="func-block-func-id">Current Function Id: {funcId}</div>
    </div>
  );
}

export default FuncBlock;
