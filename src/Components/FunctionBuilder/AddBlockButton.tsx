import React, { ChangeEvent, useCallback, useState} from 'react';
import { data_types } from '../../engine/datatype_def'
import {Button} from "@mantine/core";

function AddBlockButton(props: any) {
  const onClick = props.onClick;
  const defaultAttr = props.defaultAttr;
  const buttonText = props.buttonText;
  const localOnClick = useCallback(() => {
    onClick(...defaultAttr);
  }, [onClick])

  return <Button variant='default' onClick={localOnClick}>{buttonText}</Button>;
}

export default AddBlockButton;
