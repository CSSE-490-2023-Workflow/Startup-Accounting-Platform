import React, { ChangeEvent, useCallback, useState} from 'react';

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

  return <button onClick={localOnClick}>{name}</button>;
}

export default PageButton;
