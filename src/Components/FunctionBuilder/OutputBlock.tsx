import React, { useCallback, useState} from 'react';
import { data_types } from "../../engine/datatype_def"

function OutputBlock(props: any) {
  const [ id, name, editCB, removeCB ] = [props.blockId, props.outputName, props.updateBlkCB, props.removeBlkCB]
  const [ outputName, setName] = useState(name)

  function handleNameChange(e: any) {
    setName(e.target.value);
    editCB(id, e.target.value);
  }


  function handleRemoveBlock(e: any) {
    removeCB(id);
  }

  return (
    <div className="output-block func-builder-block">
      <div className="output-block-id">{id}</div>
      <div className="output-block-name">{outputName}</div>
      <button className='block-remove' onClick={handleRemoveBlock}>Remove Block</button>
      <input className="output-block-name" type="text" onChange={handleNameChange} value={outputName} />
    </div>
  );
}

export default OutputBlock;