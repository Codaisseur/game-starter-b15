import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'
import { Color, Guess } from './entities'

// const randomColor = (): Color => {
//   const colors: Array<Color> = ['#4286f4', '#fcf953', '#ce792f']
//   let index = Math.floor(Math.random() * colors.length)
//   let newColor: Color = colors[index]
//   return newColor
// }

// export const setSecretCode = (secretCode: Array<Color>) => secretCode.map(_cell =>  randomColor())

@ValidatorConstraint()
export class IsSecretCode implements ValidatorConstraintInterface {
  validate(secretCode: Array<Color>) {
    return secretCode.length === 3 &&
      secretCode.every(cell => cell !== null)
  }
}

export const isValidTransition = (guessedCode: Guess) => {
  const changes = guessedCode
  .every(cell => cell !== null)

  return changes
}


//calculate winner and finished game = TBD

/*
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
*/