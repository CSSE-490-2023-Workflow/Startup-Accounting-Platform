import React, { ChangeEvent, useCallback, useState} from 'react';
import { data_types } from '../../engine/datatype_def'

function AddBlockButton(props: any) {
  const onClick = props.onClick;
  const localOnClick = useCallback(() => {
    onClick("new input", data_types.dt_number);
  }, [onClick])

  return <button onClick={localOnClick}>Add Input Block</button>;
}

export default AddBlockButton;
