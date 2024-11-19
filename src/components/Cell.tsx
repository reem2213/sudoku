import React from 'react';
import './Cell.css';


interface CellProps {
  value: string | null;
  conflict: boolean;
  hinted: boolean;
  onChange: (value: string | null) => void;
}

const Cell: React.FC<CellProps> = ({ value, conflict,hinted= false, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (/^[1-9]$/.test(inputValue) || inputValue === '') {
      onChange(inputValue || null); // this updates the cell's value in the Board Comp
    }
  };

  return (
    <input
      className={`cell ${conflict ? 'conflict' : ''} ${
        hinted ? 'hinted' : ''
      }`} 
      value={value || ''}
      onChange={handleChange}
      maxLength={1}
    />
  );
};

export default Cell;



