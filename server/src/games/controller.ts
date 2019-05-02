import {
  JsonController,
  Authorized,
  CurrentUser,
  Post,
  Param,
  BadRequestError,
  HttpCode,
  NotFoundError,
  ForbiddenError,
  Get,
  Body,
  Patch
} from "routing-controllers";
import User from "../users/entity";
import { Game, Player } from "./entities";
import { calculateWinner, finished, gravity } from "./logic";
import { io } from "../index";

@JsonController()
export default class GameController {
  @Authorized()
  @Post("/games")
  @HttpCode(201)
  async createGame(@CurrentUser() user: User) {
    const entity = await Game.create().save();

    await Player.create({
      game: entity,
      user,
      symbol: "x"
    }).save();

    const game = await Game.findOneById(entity.id);

    io.emit("action", {
      type: "ADD_GAME",
      payload: game
    });

    return game;
  }

  @Authorized()
  @Post("/games/:id([0-9]+)/players")
  @HttpCode(201)
  async joinGame(@CurrentUser() user: User, @Param("id") gameId: number) {
    const game = await Game.findOneById(gameId);
    if (!game) throw new BadRequestError(`Game does not exist`);
    if (game.status !== "pending")
      throw new BadRequestError(`Game is already started`);

    game.status = "started";
    await game.save();

    const player = await Player.create({
      game,
      user,
      symbol: "o"
    }).save();

    io.emit("action", {
      type: "UPDATE_GAME",
      payload: await Game.findOneById(game.id)
    });

    return player;
  }

  @Authorized()
  // the reason that we're using patch here is because this request is not idempotent
  // http://restcookbook.com/HTTP%20Methods/idempotency/
  // try to fire the same requests twice, see what happens
  @Patch("/games/:id([0-9]+)")
  async updateGame(
    @CurrentUser() user: User,
    @Param("id") gameId: number,
    @Body() position: number[]
  ) {
    console.log("updateGame test!");
    const game = await Game.findOneById(gameId);
    if (!game) throw new NotFoundError(`Game does not exist`);

    const player = await Player.findOne({ user, game });

    if (!player) throw new ForbiddenError(`You are not part of this game`);
    if (game.status !== "started")
      throw new BadRequestError(`The game is not started yet`);
    if (player.symbol !== game.turn)
      throw new BadRequestError(`It's not your turn`);

    console.log("position test:", position);
    const [rowIndex, columnIndex] = position;

    const gravitatedRowIndex: number = gravity(
      game.board,
      rowIndex,
      columnIndex
    );
    console.log("gravitatedRowIndex test:", gravitatedRowIndex);

    const row = game.board[gravitatedRowIndex];
    row[columnIndex] = player.symbol;

    // These next three lines may prove unnecessary. If so, simply refer to "game" instead of "newGame" throughout the function
    await game.save();
    const newGame = await Game.findOneById(gameId);
    if (!newGame) throw new NotFoundError(`Game does not exist`);

    console.log("newGame.board test:", newGame.board);

    // columnIndex measures the x position of the user's choice.

    const winner = calculateWinner(
      newGame.board,
      gravitatedRowIndex,
      columnIndex,
      player.symbol
    );

    console.log("this is the real winner test:", winner);
    if (winner) {
      console.log("winner test:", winner);
      newGame.winner = player.symbol;
      newGame.status = "finished";
    } else if (finished(newGame.board)) {
      console.log("finished test!");
      newGame.status = "finished";
    } else {
      console.log("next players turn test!");
      newGame.turn = player.symbol === "x" ? "o" : "x";
    }
    await newGame.save();

    io.emit("action", {
      type: "UPDATE_GAME",
      payload: newGame
    });

    return newGame;
  }

  @Authorized()
  @Get("/games/:id([0-9]+)")
  getGame(@Param("id") id: number) {
    return Game.findOneById(id);
  }

  @Authorized()
  @Get("/games")
  getGames() {
    return Game.find();
  }
}
