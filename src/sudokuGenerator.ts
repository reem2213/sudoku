// funct to check if placing a number is valid
const isValidPlacement = (board: number[][], row: number, col: number, num: number): boolean => {
    
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num) return false;
    }
  
    
    for (let i = 0; i < 9; i++) {
      if (board[i][col] === num) return false;
    }
  
    
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[startRow + i][startCol + j] === num) return false;
      }
    }
  
    return true;
  };
  
  //we use the Backtracking algorithm to solve the board
  export const solveBoard = (board: number[][]): boolean => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValidPlacement(board, row, col, num)) {
              board[row][col] = num;
              if (solveBoard(board)) return true;
              board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  };
  
  
  const generateCompleteBoard = (): number[][] => {
    const board = Array.from({ length: 9 }, () => Array(9).fill(0));
    solveBoard(board);
    return board;
  };
  
  // funct to remove nbs from the board based on difficulty (lvl)
  const removeNumbers = (board: number[][], difficulty: 'easy' | 'medium' | 'hard'): number[][] => {
    const numberOfCellsToRemove = difficulty === 'easy' ? 30 : difficulty === 'medium' ? 40 : 55;
    const boardCopy = board.map(row => [...row]);
  
    let cellsRemoved = 0;
    while (cellsRemoved < numberOfCellsToRemove) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      if (boardCopy[row][col] !== 0) {
        boardCopy[row][col] = 0;
        cellsRemoved++;
      }
    }
  
    return boardCopy;
  };
  

  export const generateSudokuPuzzle = (difficulty: 'easy' | 'medium' | 'hard'): number[][] => {
    const completeBoard = generateCompleteBoard();
    return removeNumbers(completeBoard, difficulty);
  };
  

  