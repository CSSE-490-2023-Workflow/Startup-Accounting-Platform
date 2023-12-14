import React, { useCallback, useState} from 'react';
import { data_types } from "../../engine/datatype_def"

function InputBlock(props: any) {
  const [ id, name, type, typeOptions, editCB, removeCB ] = [props.blockId, props.inputName, props.inputType, props.inputTypeOptions, props.updateBlkCB, props.removeBlkCB]
  const [inputName, setName] = useState(name)
  const [inputType, setType] = useState(type)

  function handleNameChange(e: any) {
    setName(e.target.value);
    editCB(id, e.target.value, inputType);
  }

  function handleTypeChange(e: any) {
    setType(e.target.value);
    editCB(id, inputName, e.target.value);
  }

  function handleRemoveBlock(e: any) {
    removeCB(id);
  }

  const data_types_options = typeOptions.map(([id, dt_name] : [data_types, string]) => (
    <option value={id}>{dt_name}</option>
  ))
  return (
    <div className="input-block func-builder-block">
      <div className="input-block-id">{id}</div>
      <button className='block-remove' onClick={handleRemoveBlock}>Remove Block</button>
      <input className="input-block-name" type="text" onChange={handleNameChange} value={inputName} />
      <select className="input-block-type" value={inputType} onChange={handleTypeChange}>
        {data_types_options}
      </select>
    </div>
  );
}

export default InputBlock;