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

export const isValidTransition = (
  playerSymbol: Symbol,
  from: Board,
  to: Board
) => {
  const changes = from
    .map((row, rowIndex) =>
      row.map((symbol, columnIndex) => ({
        from: symbol,
        to: to[rowIndex][columnIndex]
      }))
    )
    .reduce((a, b) => a.concat(b))
    .filter(change => change.from !== change.to);

  return (
    changes.length === 1 &&
    changes[0].to === playerSymbol &&
    changes[0].from === null
  );
};

export const calculateWinner = (board: Board): Symbol | null => {
  let winning: Symbol[] = [];

  board
    .concat([0, 1, 2, 3, 4, 5, 6].map(n => board.map(row => row[n])) as Row[])
    .concat([
      // diagonal winner ltr
      [0, 1, 2, 3, 4, 5, 6].map(n => board[n === 6 ? n - 1 : n][n])
      // [0, 1, 2, 3, 4, 5, 6].map(n => {
      //   return board[n === 0 ? 5 : 6 - n][n];
      // })
    ] as Row[])

    .map(row => {
      // go over the rows and select by rules
      row.forEach((symbol, index) => {
        if (winning.length === 4) {
          return;
        }
        // check if could win
        if (symbol && winning.length === 0) {
          winning = [symbol];
        } else if (symbol && winning.indexOf(symbol) !== -1) {
          // set if symbol exists in array
          winning.push(symbol);
        } else if (row[index - 1] !== symbol && symbol) {
          // otherwise set array empty
          winning = [symbol];
        } else {
          // set if nothing was met
          winning = [];
        }
      });

      return winning;
    });
  console.log("return calculate winner", winning);
  return winning[0] || null;
};

export const finished = (board: Board): boolean =>
  board.reduce((a, b) => a.concat(b) as Row).every(symbol => symbol !== null);
