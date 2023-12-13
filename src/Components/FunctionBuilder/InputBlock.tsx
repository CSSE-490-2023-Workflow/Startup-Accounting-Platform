import React, { ChangeEvent, useCallback, useState} from 'react';
import { data_types, data_type_enum_to_name, data_type_name_to_enum, declared_type_verifier, is_number, is_integer} from "../../engine/datatype_def"

function InputBlock(props: any) {
  const [ id, name, type, editCB, removeCB ] = [props.inputId, props.inputName, props.inputType, props.updateBlkCB, props.removeBlkCB]
  const [inputName, setName] = useState(name)
  const [inputType, setType] = useState(type)

  function handleNameChange(e: any) {
    editCB(id, e.target.value, inputType);
  }

  function handleTypeChange(e: any) {
    editCB(id, inputName, e.target.value);
  }
  const data_types_options = data_type_enum_to_name.map((dt_name) => {
    return (
      <option value={data_type_name_to_enum[dt_name]}>{dt_name}</option>
    )
  })
  return (
    <div className="input-block">
      <div className="input-block-id">{id}</div>
      <input className="input-block-name" type="text" onChange={handleNameChange} value={inputName} />
      <select className="input-block-type" value={inputType} onChange={handleTypeChange}>
        {data_types_options}
      </select>
    </div>
  );
}

export default InputBlock;