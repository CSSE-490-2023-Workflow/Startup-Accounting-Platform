import { useCallback } from "react";

export function TestComponent(props: any) {

  const { testCB } = props;
  const testFunc = useCallback(() => {
    testCB();
  }, [])
  return <button onClick={testFunc}>child button</button>
}