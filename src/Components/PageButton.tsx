import React, { ChangeEvent, useCallback, useState} from 'react';
import {Button} from "@mantine/core";

interface IProps {
    onClick: (val: number) => void
    value: number
    name: string
}

function PageButton(props: IProps) {
  const { onClick, value, name} = props
  const localOnClick = useCallback(() => {
    onClick(value);
  }, [])

  return <Button onClick={localOnClick}>{name}</Button>;
}

export default PageButton;
