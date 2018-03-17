import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'
import { Board, Symbol } from './entities';

@ValidatorConstraint()
export class IsBoard implements ValidatorConstraintInterface {

  validate(board: Board) {
    const symbols = [ 'x', 'o', null ]
    return board.length === 3 &&
      board.every(row =>
        row.length === 3 &&
        row.every(symbol => symbols.includes(symbol))
      )
  }
}

export const isValidTransition = (playerSymbol: Symbol, from: Board, to: Board) =>
  from
    .map((row, rowIndex) =>
      row.filter(
        (oldSymbol, columnIndex) => {
          const newSymbol = to[rowIndex][columnIndex]
          return oldSymbol !== newSymbol &&
            // location was empty before
            oldSymbol === null &&
            // new symbol is current turn
            newSymbol === playerSymbol
        }        
      )
    )
    // allow 1 move, and 1 move only
    .filter(row => row.length === 1).length === 1

export const calculateWinner = (board: Board): Symbol | null =>
  // horizontal winner
  board
    .filter(row => row[0] && row.every(symbol => symbol === row[0]))
    .map(row => row[0])[0] ||

  // vertical winner
  board[0]
    .map((_, index) => board.map(row => row[index]))
    .filter(row => row[0] && row.every(symbol => symbol === row[0]))
    .map(row => row[0])[0] || 
  
  // diagonal winner ltr
  [0, 1, 2]
    .map(n => board[n][n])
    .filter((symbol, _, all) => symbol == all[0])[2] ||

  // diagonal winner rtl
  [2, 1, 0]
    .map(n => board[n][2-n])
    .filter((symbol, _, all) => symbol == all[0])[2] || 
  
  null
  