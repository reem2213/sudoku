import React, { useState } from "react";
import Tesseract from "tesseract.js";
import Board from "./components/Board";
import ImageBoard from "./components/Image-board";
import './App.css'
const App: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [extractedNumbers, setExtractedNumbers] = useState<number[][]>(
    Array(9)
      .fill(null)
      .map(() => Array(9).fill(0))
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const extractNumbersFromImage = () => {
    if (image) {
      console.log("Starting OCR extraction with position data...");

      // Create a new Image object to get the dimensions
      const img = new Image();
      img.src = URL.createObjectURL(image);

      img.onload = () => {
        const imageWidth = img.width;
        const imageHeight = img.height;

        // Perform OCR with Tesseract.js
        Tesseract.recognize(image, "eng", {
          logger: (m) => console.log(m), // Log progress
        })
          .then(({ data: { symbols } }) => {
            if (!symbols) {
              console.error("No symbols detected");
              return;
            }

            // Initialize a 9x9 grid with zeros
            const grid = Array(9)
              .fill(null)
              .map(() => Array(9).fill(0));

            // Calculate cell width and height
            const cellWidth = imageWidth / 9;
            const cellHeight = imageHeight / 9;

            // Map characters to the grid using bounding box data
            symbols.forEach((symbol) => {
              const { text, bbox } = symbol;
              if (text.match(/[0-9]/)) {
                const num = parseInt(text, 10);
                const col = Math.floor(bbox.x0 / cellWidth);
                const row = Math.floor(bbox.y0 / cellHeight);
                if (row < 9 && col < 9) {
                  grid[row][col] = num;
                }
              }
            });

            console.log("Mapped 9x9 Grid with Spatial Data:", grid);
            setExtractedNumbers(grid);
          })
          .catch((error) => {
            console.error("OCR Error:", error);
          });
      };
    } else {
      console.warn("No image selected ");
    }
  };

  const solveSudoku = (board: number[][]): boolean => {
    const findEmpty = (): [number, number] | null => {
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (board[i][j] === 0) return [i, j];
        }
      }
      return null;
    };

    const isValid = (num: number, pos: [number, number]): boolean => {
      const [row, col] = pos;

      // for row
      for (let i = 0; i < 9; i++) {
        if (board[row][i] === num && col !== i) return false;
      }

      // for column
      for (let i = 0; i < 9; i++) {
        if (board[i][col] === num && row !== i) return false;
      }

      // for the mini grid
      const boxRow = Math.floor(row / 3) * 3;
      const boxCol = Math.floor(col / 3) * 3;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (board[boxRow + i][boxCol + j] === num) return false;
        }
      }

      return true;
    };

    const empty = findEmpty();
    if (!empty) return true; // solved
    const [row, col] = empty;

    for (let num = 1; num <= 9; num++) {
      if (isValid(num, [row, col])) {
        board[row][col] = num;
        if (solveSudoku(board)) return true;
        board[row][col] = 0;
      }
    }

    return false;
  };

  const handleSolve = () => {
    if (extractedNumbers) {
      const boardCopy = extractedNumbers.map((row) => [...row]);
      if (solveSudoku(boardCopy)) {
        console.log("Sudoku solved successfully:", boardCopy);
        setExtractedNumbers(boardCopy);
      } else {
        console.error("Sudoku could not be solved");
      }
    } else {
      console.warn("No numbers extracted to solve");
    }
  };

  return (
    <>
      <div className="container">
        <div>
          <h1>Sudoku Image Upload Solver</h1>
          <input type="file" onChange={handleImageUpload} />
          <button onClick={extractNumbersFromImage}>Extract Numbers</button>
          <button onClick={handleSolve}>Solve</button>
          <ImageBoard numbers={extractedNumbers} />
        </div>

        <div className="App">
          <h1>Sudoku Game</h1>
          <Board />
        </div>
      </div>
    </>
  );
};

export default App;
