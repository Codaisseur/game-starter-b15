import {
  JsonController, Authorized, CurrentUser, Post, Param, BadRequestError, HttpCode, NotFoundError, ForbiddenError, Get,
 /* Body,*/ Patch
} from 'routing-controllers'
import User from '../users/entity'
import { Game, Player, Color } from './entities'
import { /*IsSecretCode,*/ isValidTransition,/* calculateWinner, finished, setSecretCode*/ } from './logic'
// import { Validate } from 'class-validator'
import { io } from '../index'
/*
class GameUpdate {
  @Validate(IsSecretCode, {
    message: 'Not a valid secret code'
  })
  secretCode: Array<Color>
}
*/

const randomColor = (): Color => {
  const colors: Array<Color> = ['#4286f4', '#fcf953', '#ce792f']
  let index = Math.floor(Math.random() * colors.length)
  let newColor: Color = colors[index]
  console.log('random', newColor)
  return newColor
}


@JsonController()
export default class GameController {

  @Authorized()
  @Post('/games')
  @HttpCode(201)
  async createGame(
    @CurrentUser() user: User
  ) {

    console.log(user)
    const entity = await Game.create({
      secretCode: [randomColor(), randomColor(), randomColor()],
    }).save()

    await Player.create({
      game: entity,
      user,
    }).save()
    console.log(Player)

    const game = await Game.findOneById(entity.id)
    if (!game) {
      throw new Error
    }

    const { secretCode, ...gameWithoutSecretCode } = game
    io.emit('action', {
      type: 'ADD_GAME',
      payload: gameWithoutSecretCode
    })

    return gameWithoutSecretCode
  }

  @Authorized()
  @Post('/games/:id([0-9]+)/players')
  @HttpCode(201)
  async joinGame(
    @CurrentUser() user: User,
    @Param('id') gameId: number
  ) {
    const game = await Game.findOneById(gameId)
    if (!game) throw new BadRequestError(`Game does not exist`)
    if (game.status !== 'pending') throw new BadRequestError(`Game is already started`)

    game.status = 'started'
    await game.save()

    const player = await Player.create({
      game,
      user,
    }).save()

    io.emit('action', {
      type: 'UPDATE_GAME',
      payload: await Game.findOneById(game.id)
    })

    return player
  }

  //PATCH => TBD

  @Authorized()
  // the reason that we're using patch here is because this request is not idempotent
  // http://restcookbook.com/HTTP%20Methods/idempotency/
  // try to fire the same requests twice, see what happens
  @Patch('/games/:id([0-9]+)')
  //Patch trimite o mutare 
  //tb sa verifici:
  //care dinte cei doi jucatori e
  //e jucatorul catre trimite mutarea e cel curent (true)
  //e mutarea una buna? valida?
  //apoi fa mutarea => adauga culori in playerInput; schimba playerOneTurn 
  //to it's negated (f to t and t to f)
  //compara codurile si trimite rezultatul
  async updateGame(
    @CurrentUser() user: User,
    @Param('id') gameId: number,
    // @Body() update: GameUpdate
  ) {
    const game = await Game.findOneById(gameId)
    if (!game) throw new NotFoundError(`Game does not exist`)

    const player = await Player.findOne({ user, game })

    if (!player) throw new ForbiddenError(`You are not part of this game`)
    if (game.status !== 'started') throw new BadRequestError(`The game is not started yet`)
    if (game.playerOneTurn !== false) throw new BadRequestError(`It's not your turn`)
    if (!isValidTransition(player.playerGuess)) {
      throw new BadRequestError(`Invalid move`)
    }
    /*
        const winner = calculateWinner(update.board)
        if (winner) {
          game.winner = winner
          game.status = 'finished'
        }
        else if (finished(update.board)) {
          game.status = 'finished'
        }
        else {
          game.turn = player.symbol === 'x' ? 'o' : 'x'
        }
        game.board = update.board
        await game.save()
        */
    io.emit('action', {
      type: 'UPDATE_GAME',
      payload: game
    })

    return game
  }



  @Authorized()
  @Get('/games/:id([0-9]+)')
  getGame(
    @Param('id') id: number
  ) {
    return Game.findOneById(id)
  }

  @Authorized()
  @Get('/games')
  getGames() {
    return Game.find()
  }
}

