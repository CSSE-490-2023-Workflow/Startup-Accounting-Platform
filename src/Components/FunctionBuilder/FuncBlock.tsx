import React, { ChangeEvent, useCallback, useState} from 'react';
import { id_to_builtin_func } from '../../engine/builtin_func_def'
import { Card, Input, CloseButton, CardSection } from '@mantine/core';

function FuncBlock(props: any) {
  const [ blkId, funcId, funcName, funcOptions, paramTypes, outputTypes, editCB, removeCB ] = [props.blockId, props.funcId, props.funcName, props.funcOptions, props.paramTypes, props.outputTypes, props.updateBlkCB, props.removeBlkCB]

  const param_count: number = paramTypes.length;
  const param_node_inc: number = 100 / (param_count + 1);
  const param_node_pos: string[] = [];
  for (let i = 1; i <= param_count; i++) {
    param_node_pos.push(String(param_node_inc * i) + '%')
  }
  const output_count: number = outputTypes.length;

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

  const param_node_list = param_node_pos.map((offset: string) => {
    console.log(offset);
    return (
      <>
        <div className='connection-handle' style={{top: offset}}>
        </div>
      </>
    );
  })

  return (
    <>
    
      
    <div className='block-container'>
    <Card className="func-block func-builder-block" shadow='sm' padding='lg' radius='md' withBorder>
      <Card.Section className='block-header'>
        <div className="block-type-desc">Function Block</div>
        <CloseButton className='block-remove' onClick={handleRemoveBlock} />
      </Card.Section>
      <hr className='solid-divider' />
      <CardSection>
        <select className="func-block-func-select" value={funcId} onChange={handleFuncChange}>
          {func_options}
        </select>
      </CardSection>
      <Card.Section>
        <div className="func-block-func-id">Current Function Id: {funcId}</div>
      </Card.Section>
    </Card>
    {param_node_list}
    </div>
    </>
  );
}

export default FuncBlock;
