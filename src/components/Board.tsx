import React, { useState } from "react";
import Cell from "./Cell";
import { generateSudokuPuzzle, solveBoard } from "../sudokuGenerator";
import "./Board.css";

interface CellData {
  value: string | null;
  conflict: boolean;
  
  fixed: boolean; //the nbs in the cell that cannot be changed (default)
  hinted?: boolean;
}

const Board: React.FC = () => {
  const [board, setBoard] = useState<CellData[][]>(() => {
    const initialBoard = generateSudokuPuzzle("easy");
    return initialBoard.map((row) =>
      row.map((value) => ({
        value: value !== 0 ? value.toString() : null,
        conflict: false,
        fixed: value !== 0,
        hinted: false,
      }))
    );
  });

  const [message, setMessage] = useState<string | null>(null);

  const handleCellChange = (row: number, col: number, value: string | null) => {
    if (board[row][col].fixed) return; 

    const newBoard = board.map((r, rowIndex) =>
      r.map((cell, colIndex) => {
        if (rowIndex === row && colIndex === col) {
          return { ...cell, value };
        }
        return cell;
      })
    );
    
    validateBoard(newBoard); //so we call the validateBoard function to check if there is any conflict.
    setBoard(newBoard);
  };

  const validateBoard = (board: CellData[][]) => {
    let hasConflict = false;

    //to reset all the conflicts
    const newBoard = board.map((row) =>
      row.map((cell) => ({ ...cell, conflict: false }))
    );

   
    for (let row = 0; row < 9; row++) {
      const seen: { [key: string]: boolean } = {};
      for (let col = 0; col < 9; col++) {
        const value = newBoard[row][col].value;
        if (value) {
          if (seen[value]) {
            hasConflict = true;
            for (let c = 0; c < 9; c++) {
              if (newBoard[row][c].value === value) {
                newBoard[row][c].conflict = true;
              }
            }
          } else {
            seen[value] = true;
          }
        }
      }
    }

  
    for (let col = 0; col < 9; col++) {
      const seen: { [key: string]: boolean } = {};
      for (let row = 0; row < 9; row++) {
        const value = newBoard[row][col].value;
        if (value) {
          if (seen[value]) {
            hasConflict = true;
            for (let r = 0; r < 9; r++) {
              if (newBoard[r][col].value === value) {
                newBoard[r][col].conflict = true;
              }
            }
          } else {
            seen[value] = true;
          }
        }
      }
    }

    
    for (let gridRow = 0; gridRow < 3; gridRow++) {
      for (let gridCol = 0; gridCol < 3; gridCol++) {
        const seen: { [key: string]: boolean } = {};
        for (let row = gridRow * 3; row < gridRow * 3 + 3; row++) {
          for (let col = gridCol * 3; col < gridCol * 3 + 3; col++) {
            const value = newBoard[row][col].value;
            if (value) {
              if (seen[value]) {
                hasConflict = true;
                for (let r = gridRow * 3; r < gridRow * 3 + 3; r++) {
                  for (let c = gridCol * 3; c < gridCol * 3 + 3; c++) {
                    if (newBoard[r][c].value === value) {
                      newBoard[r][c].conflict = true;
                    }
                  }
                }
              } else {
                seen[value] = true;
              }
            }
          }
        }
      }
    }

    setBoard(newBoard);

    if (hasConflict) {
      setMessage("Conflicts detected!click so see the conflict cells.");
    } else {
      setMessage("No conflicts found");
    }
  };

  const handleShowConflicts = () => {
    validateBoard(board);
  };


  const handleSolve = () => {
    const boardArray = board.map((row) =>
      row.map((cell) => (cell.value ? parseInt(cell.value) : 0))
    );

    if (solveBoard(boardArray)) {
      setBoard(
        boardArray.map((row) =>
          row.map((value) => ({
            value: value !== 0 ? value.toString() : null,
            conflict: false,
            fixed: false,
          }))
        )
      );
    } else {
      alert("This Sudoku cannot be solved.");
    }
  };
  const handleHint = () => {
    const boardArray = board.map((row) =>
      row.map((cell) => (cell.value ? parseInt(cell.value) : 0))
    );
  
    if (solveBoard(boardArray)) {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (board[row][col].value === null) {
            const correctValue = boardArray[row][col];
            const newBoard = board.map((r, rowIndex) =>
              r.map((cell, colIndex) => {
                if (rowIndex === row && colIndex === col) {
                  return {
                    ...cell,
                    value: correctValue.toString(),
                    hinted: true, 
                  };
                }
                return { ...cell, hinted: false };
              })
            );
  
            setBoard(newBoard);
            return;
          }
        }
      }
    } else {
      alert("This Sudoku puzzle cannot be solved.");
    }
  };
  

  const handleDifficultyChange = (difficulty: "easy" | "medium" | "hard") => {
    const newPuzzle = generateSudokuPuzzle(difficulty);
    setBoard(
      newPuzzle.map((row) =>
        row.map((value) => ({
          value: value !== 0 ? value.toString() : null,
          conflict: false,
          fixed: value !== 0,
        }))
      )
    );
  };

  return (
    <div>
     
      <div className="difficulty-buttons">
        <button onClick={() => handleDifficultyChange("easy")}>Easy</button>
        <button onClick={() => handleDifficultyChange("medium")}>Medium</button>
        <button onClick={() => handleDifficultyChange("hard")}>Hard</button>
        <button onClick={handleSolve}>Solve</button>
        <button onClick={handleHint}>Hint</button>
      </div>
      <button className="show-conflicts-button" onClick={handleShowConflicts}>
        Show Conflicts
      </button>
      {message && <p className="message">{message}</p>}
      <div className="board">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              value={cell.value}
              conflict={cell.conflict}
              hinted={cell.hinted ?? false} 
              onChange={(value: string | null) =>
                handleCellChange(rowIndex, colIndex, value)
              }
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Board;
