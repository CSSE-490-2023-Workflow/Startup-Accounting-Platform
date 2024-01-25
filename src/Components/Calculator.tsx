import React, { useCallback, useState } from 'react';
import NumberInput from './NumberInput';
import { func_2, func_interpreter_new_caller } from '../engine/engine'

const Calculator: React.FC = () => {
    const [currentInput, setCurrentInput] = useState('');
    const [result, setResult] = useState('');
  
    const handleButtonClick = (value: string) => {
      if (value === '=') {
        try {
          setResult(eval(currentInput).toString());
        } catch (error) {
          setResult('Error');
        }
      } else if (value === 'C') {
        setCurrentInput('');
        setResult('');
      } else {
        const newInput = currentInput + value;
        setCurrentInput(newInput);
        try {
          setResult(eval(newInput).toString());
        } catch (error) {
          setResult('Error');
        }
      }
    };
  
    return (
      <div>
        <div className="calculator">
          <div className="input">
            <input type="text" value={currentInput} readOnly />
          </div>
          <div className="buttons">
            <button onClick={() => handleButtonClick('1')}>1</button>
            <button onClick={() => handleButtonClick('2')}>2</button>
            <button onClick={() => handleButtonClick('3')}>3</button>
            <button onClick={() => handleButtonClick('+')}>+</button>
            <button onClick={() => handleButtonClick('4')}>4</button>
            <button onClick={() => handleButtonClick('5')}>5</button>
            <button onClick={() => handleButtonClick('6')}>6</button>
            <button onClick={() => handleButtonClick('-')}>-</button>
            <button onClick={() => handleButtonClick('7')}>7</button>
            <button onClick={() => handleButtonClick('8')}>8</button>
            <button onClick={() => handleButtonClick('9')}>9</button>
            <button onClick={() => handleButtonClick('*')}>*</button>
            <button onClick={() => handleButtonClick('0')}>0</button>
            <button onClick={() => handleButtonClick('C')}>C</button>
            <button onClick={() => handleButtonClick('=')}>=</button>
            <button onClick={() => handleButtonClick('/')}>/</button>
          </div>
        </div>
        <div className="result">
          <p>Result: {result}</p>
        </div>
      </div>
    );
  };
  
  export default Calculator;