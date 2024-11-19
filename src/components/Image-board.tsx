import React from 'react';
import './style.css';

interface BoardProps {
  
  numbers: number[][];
}

const SudokuBoard: React.FC<BoardProps> = ({ numbers }) => {
  return (
    <div className="sudoku-board">
      {numbers.map((row, rowIndex) => (
        <div className="sudoku-row" key={rowIndex}>
          {row.map((cell, cellIndex) => (
            <div className="sudoku-cell" key={cellIndex}>
              {cell !== 0 ? cell : ''}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default SudokuBoard;
