import { Connect4 } from "./connect4";
import { Ball, Player } from "./elements";
import { players } from "./elements";

class Game {
  canvas: HTMLCanvasElement;
  c: CanvasRenderingContext2D;
  connect4: Connect4;
  columnHeight: number[];
  ballsInColumn: Ball[][];
  gameOver: boolean;

  readonly span: number = 50;
  readonly boardAreaMarginLeft: number;
  readonly boardAreaMarginTop: number;
  readonly boardHeight: number;
  readonly boardWidth: number;

  constructor() {
    this.connect4 = new Connect4();
    this.boardHeight = this.span * this.connect4.HEIGHT;
    this.boardWidth = this.span * this.connect4.WIDTH;
    this.boardAreaMarginLeft = 30;
    this.boardAreaMarginTop = 10;
    this.canvas = <HTMLCanvasElement>document.getElementById("cnvs");
    this.c = this.canvas.getContext("2d");
    this.reset();
  }

  start(): void {
    this.drawGrid();
    this.initEventsListeners();
  }

  reset(): void {
    this.columnHeight = [];
    this.ballsInColumn = [];
    this.gameOver = false;
    for (let i = 0; i < this.connect4.WIDTH; i++) {
      this.columnHeight[i] = this.connect4.HEIGHT;
      this.ballsInColumn[i] = [];
    }
    this.connect4.reset();
    this.drawLastFinalState();
  }

  initEventsListeners = (): void => {
    let connect4 = this.connect4;
    this.canvas.addEventListener("click", e => {
      let [row, col, isMouseInsideBoard] = this.getMousePosition(e);
      if (
        isMouseInsideBoard &&
        this.connect4.isPlayable(col) &&
        !this.gameOver
      ) {
        this.drawDropingBall(col);
        this.connect4.move(col);
      }
    });
    this.canvas.addEventListener("mousemove", e => {
      let columnHighlightingColor =
        players[connect4.getCurrentPlayerId()].columnHighlightingColor;
      let [, col, isMouseInsideBoard] = this.getMousePosition(e);
      if (isMouseInsideBoard) {
        this.drawLastFinalState();
        this.c.beginPath();
        this.c.rect(
          this.boardAreaMarginLeft + col * this.span,
          this.boardAreaMarginTop,
          this.span,
          this.boardHeight
        );
        this.c.fillStyle = columnHighlightingColor;
        this.c.fill();
        this.c.closePath();
      } else {
        this.drawLastFinalState();
      }
    });
  };

  getMousePosition = (e): [number, number, boolean] => {
    let col = (e.offsetX - this.boardAreaMarginLeft) / this.span;
    col = Math.floor(col);
    let row = (e.offsetY - this.boardAreaMarginTop) / this.span;
    row = Math.floor(row);
    let isMouseInsideBoard: boolean =
      col >= 0 &&
      col < this.connect4.WIDTH &&
      row >= 0 &&
      row < this.connect4.HEIGHT;
    return [row, col, isMouseInsideBoard];
  };

  drawGrid(): void {
    let numHorizentalLines = this.connect4.HEIGHT + 1;
    let numVerticalLines = this.connect4.WIDTH + 1;
    let lengthHorizentalLine = this.connect4.WIDTH * this.span;
    let lengthVerticalLine = this.connect4.HEIGHT * this.span;

    let offsetX = this.boardAreaMarginLeft;
    let offsetY = this.boardAreaMarginTop;

    for (let i = 0; i < numHorizentalLines; i++) {
      this.c.beginPath();
      let y = offsetY + this.span * i;
      let x1 = offsetX;
      let x2 = offsetX + lengthHorizentalLine;
      this.c.moveTo(x1, y);
      this.c.lineTo(x2, y);
      this.c.stroke();
    }
    for (let j = 0; j < numVerticalLines; j++) {
      this.c.beginPath();
      let x = offsetX + this.span * j;
      let y1 = offsetY;
      let y2 = offsetY + lengthVerticalLine;
      this.c.moveTo(x, y1);
      this.c.lineTo(x, y2);
      this.c.stroke();
    }
  }

  drawLastFinalState = (): void => {
    this.c.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawGrid();
    this.drawExistingBalls();
  };

  drawDropingBall = (col: number): void => {
    let dy: number = 30;
    let halfSpan: number = this.span / 2;
    let radius = halfSpan - 3;
    let x = this.boardAreaMarginLeft + (2 * col + 1) * halfSpan;
    let y = this.boardAreaMarginTop + halfSpan;
    let distance =
      this.boardAreaMarginTop + this.columnHeight[col] * this.span - halfSpan;
    let player = players[this.connect4.getCurrentPlayerId()];
    let animate = () => {
      this.drawLastFinalState();
      this.drawNewBall(player, x, y + dy / 2, radius);
      y += dy;
      if (y < distance) requestAnimationFrame(animate);
      else {
        this.ballsInColumn[col].push(new Ball(player, x, distance, radius));
        this.drawLastFinalState();
        if (this.connect4.isLegalHasWon(this.connect4.getBoard(player))) {
          this.gameOver = true;
          this.message("message", `${player.name} wins`);
        }
      }
    };
    animate();
    this.columnHeight[col]--;
  };

  drawExistingBalls = (): void => {
    for (let index = 0; index < this.connect4.WIDTH; index++) {
      let balls = this.ballsInColumn[index];
      for (let ballIndex = 0; ballIndex < balls.length; ballIndex++) {
        balls[ballIndex].draw(this.c);
      }
    }
  };

  drawNewBall = (
    player: Player,
    x: number,
    y: number,
    radius: number
  ): void => {
    let ball = new Ball(player, x, y, radius);
    ball.draw(this.c);
  };

  message(divName: string, mesg: string): void {
    const elt = document.getElementById(divName);
    elt.innerText = mesg;
  }
}

export = Game;
