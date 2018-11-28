import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'
import { Color, PickCode, palette } from './entities'

const randomColor = (): Color => {
  const colors: Array<Color> = ['#4286f4', '#fcf953', '#ce792f']
  let index = Math.floor(Math.random() * colors.length)
  let newColor: Color = colors[index]
  return newColor
}

let secretCode = [null, null, null]

const setSecretCode = secretCode => secretCode.map(cell => {
  if (cell === null) {
    cell = randomColor()
  }
})

secretCode = setSecretCode(secretCode)

@ValidatorConstraint()
export class IsSecretCode implements ValidatorConstraintInterface {
  
  validate(secretCode: Array<Color>) {
    return secretCode.length === 3 &&
      secretCode.every(cell => cell !== null)
  }
}

@ValidatorConstraint()
export class IsPickCodeRow implements ValidatorConstraintInterface {
  validate(row: PickCode) {
    return row.length === 3 &&
      row.every(cell => cell === null)
  }
}
//   validate(board: Board) {
//     const symbols = [ 'x', 'o', null ]
//     return board.length === 3 &&
//       board.every(row =>
//         row.length === 3 &&
//         row.every(symbol => symbols.includes(symbol))
//       )
//   }
// }


export const isValidTransition = (guessedCode: PickCode) => {
  const changes = guessedCode
  .every(cell => cell !== null)

  return changes
}

// const changes = from
//     .map(
//       (row, rowIndex) => row.map((symbol, columnIndex) => ({
//         from: symbol,
//         to: to[rowIndex][columnIndex]
//       }))
//     )
//     .reduce((a, b) => a.concat(b))
//     .filter(change => change.from !== change.to)

//   return changes.length === 1 &&
//     changes[0].to === playerSymbol &&
//     changes[0].from === null





export const calculateWinner = (board: Board): Symbol | null =>
  board
    .concat(
      // vertical winner
      [0, 1, 2].map(n => board.map(row => row[n])) as Row[]
    )
    .concat(
      [
        // diagonal winner ltr
        [0, 1, 2].map(n => board[n][n]),
        // diagonal winner rtl
        [0, 1, 2].map(n => board[2 - n][n])
      ] as Row[]
    )
    .filter(row => row[0] && row.every(symbol => symbol === row[0]))
    .map(row => row[0])[0] || null

export const finished = (board: Board): boolean =>
  board
    .reduce((a, b) => a.concat(b) as Row)
    .every(symbol => symbol !== null)
