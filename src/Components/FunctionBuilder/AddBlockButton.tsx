import React, { ChangeEvent, useCallback, useState} from 'react';
import { data_types } from '../../engine/datatype_def'

function AddBlockButton(props: any) {
  const onClick = props.onClick;
  const defaultAttr = props.defaultAttr;
  const buttonText = props.buttonText;
  const localOnClick = useCallback(() => {
    onClick(...defaultAttr);
  }, [onClick])

  return <button onClick={localOnClick}>{buttonText}</button>;
}

export default AddBlockButton;
