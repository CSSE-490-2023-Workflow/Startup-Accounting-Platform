import React, { useCallback, useState} from 'react';
import { data_types } from "../../engine/datatype_def"
import { Card, Input, CloseButton, CardSection } from '@mantine/core';


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
  /**
   * <div className="input-block-id">{id}</div>
   */
  return (
    <div className='block-container'>
    <Card className="input-block func-builder-block" shadow='sm' padding='lg' radius='md' withBorder>
      <Card.Section className='block-header'>
        <div className="block-type-desc">Input Block</div>
        <CloseButton className='block-remove' onClick={handleRemoveBlock} />
      </Card.Section>
      <hr className='solid-divider' />
      <CardSection>
        <Input className="input-block-name" onChange={handleNameChange} value={inputName} variant="filled" placeholder="Input Name" />
      </CardSection>
      <Card.Section>
        <select className="input-block-type" value={inputType} onChange={handleTypeChange}>
          {data_types_options}
        </select>
      </Card.Section>
    </Card>
    <div className='connection-handle'></div>
    </div>
  );
}

export default InputBlock;