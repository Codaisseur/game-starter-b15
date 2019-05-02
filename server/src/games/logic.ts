import {
  ValidatorConstraint,
  ValidatorConstraintInterface
} from "class-validator";
import { Board, Symbol, Row } from "./entities";

@ValidatorConstraint()
export class IsBoard implements ValidatorConstraintInterface {
  validate(board: Board) {
    const symbols = ["x", "o", null];
    return (
      board.length === 6 &&
      board.every(
        row => row.length === 7 && row.every(symbol => symbols.includes(symbol))
      )
    );
  }
}

export const gravity = (
  board: Board,
  rowIndex: number,
  columnIndex: number,
): number => {
  const lastRowIndex = board.length -1

  for (var i = rowIndex + 1; i <= lastRowIndex; i++) {
    const row = board[i]
    const cell = row[columnIndex]
    
    if (cell) {
      return i - 1 // This is the "gravitatedRowIndex"
    }
  }

  return lastRowIndex
}

export const calculateHorizontalWinner = (
  board: Board,
  rowIndex: number,
  columnIndex: number,
  symbol: string
): boolean => {
  let row = board[rowIndex];

  let left = row[columnIndex - 1] === symbol;
  let right = row[columnIndex + 1] === symbol;

  if (left || right) {
    let farLeft = row[columnIndex - 2] === symbol;
    let farRight = row[columnIndex + 2] === symbol;

    if (left && right) {
      if (farLeft || farRight) {
        return true;
      } else {
        return false;
      }
    }

    if (left && farLeft) {
      return row[columnIndex - 3] === symbol
    }

    if (right && farRight) {
      return row[columnIndex + 3] === symbol
    }
  }
  return false;
};

export const calculateVerticalWinner = (
  board: Board,
  rowIndex: number,
  columnIndex: number,
  symbol: Symbol
): boolean => {
  const rowAbove = board[rowIndex - 1];
  let top = rowAbove && rowAbove[columnIndex] === symbol;

  const rowBelow = board[rowIndex + 1];
  let bottom = rowBelow && rowBelow[columnIndex] === symbol;

  if (top || bottom) {
    const farAbove = board[rowIndex - 2]
    let farTop = farAbove && farAbove[columnIndex] === symbol;

    const farBelow = board[rowIndex + 2]
    let farBottom = farBelow && farBelow[columnIndex] === symbol;

    if (top && bottom) {
      if (farTop || farBottom) {
        return true;
      } else {
        return false;
      }
    }

    if (top && farTop) {
      const fartherAbove = board[rowIndex - 3]
      return fartherAbove && fartherAbove[columnIndex] === symbol
    }

    if (bottom && farBottom) {
      const fartherBelow = board[rowIndex + 3]
      return fartherBelow && fartherBelow[columnIndex] === symbol
    }
  }
  return false;
};


export const calculateRisingWinner = (
  board: Board,
  rowIndex: number,
  columnIndex: number,
  symbol: Symbol
): boolean => {
  const rowBelow = board[rowIndex + 1];
  const bottomLeft = rowBelow && rowBelow[columnIndex - 1]
  const left = bottomLeft === symbol;

  const rowAbove = board[rowIndex - 1]
  const upperRight = rowAbove && rowAbove[columnIndex + 1]
  const right = upperRight === symbol;

  if (left || right) {
    const farBelow = board[rowIndex + 2]
    let farBottom = farBelow && farBelow[columnIndex - 2]
    const farLeft = farBottom === symbol;
   

    const farAbove = board[rowIndex - 2]
    let farTop = farAbove && farAbove[columnIndex + 2]
    const farRight = farTop === symbol;

    if (left && right) {
      if (farLeft || farRight) {
        return true;
      } else {
        return false;
      }
    }
    if (left || farLeft){
      const fartherLeft = board[rowIndex + 3]
      return fartherLeft && fartherLeft[columnIndex - 3] === symbol;
    }
    if (right || farRight) {
      const fartherRight = board[rowIndex - 3]
      return fartherRight && fartherRight[columnIndex + 3] === symbol;
    }
  }
  return false;
};

export const calculateFallingWinner = (
  board: Board,
  rowIndex: number,
  columnIndex: number,
  symbol: Symbol
): boolean => {
  const rowAbove = board[rowIndex - 1]
  const upperLeft = rowAbove && rowAbove[columnIndex - 1]
  const left = upperLeft === symbol;

  const rowBelow = board[rowIndex + 1]
  const bottomRight = rowBelow && rowBelow[columnIndex + 1]
  const right = bottomRight === symbol;

  if (left || right) {

    const farAbove = board[rowIndex - 2]
    let farTop = farAbove && farAbove[columnIndex - 2]
    const farLeft = farTop === symbol;

    const farBelow = board[rowIndex + 2]
    let farBottom = farBelow && farBelow[columnIndex + 2]
    const farRight = farBottom === symbol;

    if (left && right) {
      if (farLeft || farRight) {
        return true;
      } else {
        return false;
      }
    }
    if (left || farLeft){
      const fartherLeft = board[rowIndex - 3]
      return fartherLeft && fartherLeft[columnIndex - 3] === symbol;
    }

    if (right || farRight) {
      const fartherRight = board[rowIndex + 3]
      return fartherRight && fartherRight[columnIndex + 3] === symbol;
    }
  }

  return false;
};

export const calculateWinner = (
  board: Board,
  rowIndex: number,
  columnIndex: number,
  symbol: Symbol
): boolean => {
  if (
    calculateHorizontalWinner(board, rowIndex, columnIndex, symbol) ||
    calculateVerticalWinner(board, rowIndex, columnIndex, symbol) ||
    calculateRisingWinner(board, rowIndex, columnIndex, symbol) ||
    calculateFallingWinner(board, rowIndex, columnIndex, symbol)
  ) {
    return true;
  }
  return false;
};


export const finished = (board: Board): boolean =>
  board.reduce((a, b) => a.concat(b) as Row).every(symbol => symbol !== null);
