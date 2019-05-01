import { ConnectFour } from "./GameLogic.js";
import { Ball, Player } from "./Elements";
import { players } from "./Elements";

class Game {
  constructor() {
    this.connectFour = new ConnectFour();
    this.boardHeight = this.span * this.connectFour.HEIGHT;
    this.boardWidth = this.span * this.connectFour.WIDTH;
    this.boardAreaMarginLeft = 30;
    this.boardAreaMarginTop = 10;
    this.canvas = document.getElementById("cnvs");
    // <HTMLCanvasElement>
    this.c = this.canvas.getContext("2d");
    this.reset();
  }

  start() {
    this.drawGrid();
    this.initEventsListeners();
  }

  reset() {
    this.columnHeight = [];
    this.ballsInColumn = [];
    this.gameOver = false;
    for (let i = 0; i < this.connectFour.WIDTH; i++) {
      this.columnHeight[i] = this.connectFour.HEIGHT;
      this.ballsInColumn[i] = [];
    }
    this.connectFour.reset();
    this.drawLastFinalState();
  }

  initEventsListeners = () => {
    let connectFour = this.connectFour;
    this.canvas.addEventListener("click", e => {
      let [row, col, isMouseInsideBoard] = this.getMousePosition(e);
      if (
        isMouseInsideBoard &&
        this.connectFour.isPlayable(col) &&
        !this.gameOver
      ) {
        this.drawDroppingBall(col);
        this.connectFour.move(col);
      }
    });
    this.canvas.addEventListener("mousemove", e => {
      let columnHighlightingColor =
        players[connectFour.getCurrentPlayerId()].columnHighlightingColor;
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

  getMousePosition = e => {
    let col = (e.offsetX - this.boardAreaMarginLeft) / this.span;
    col = Math.floor(col);
    let row = (e.offsetY - this.boardAreaMarginTop) / this.span;
    row = Math.floor(row);
    let isMouseInsideBoard =
      col >= 0 &&
      col < this.connectFour.WIDTH &&
      row >= 0 &&
      row < this.connectFour.HEIGHT;
    return [row, col, isMouseInsideBoard];
  };

  drawGrid() {
    let numHorizontalLines = this.connectFour.HEIGHT + 1;
    let numVerticalLines = this.connectFour.WIDTH + 1;
    let lengthHorizontalLine = this.connectFour.WIDTH * this.span;
    let lengthVerticalLine = this.connectFour.HEIGHT * this.span;

    let offsetX = this.boardAreaMarginLeft;
    let offsetY = this.boardAreaMarginTop;

    for (let i = 0; i < numHorizontalLines; i++) {
      this.c.beginPath();
      let y = offsetY + this.span * i;
      let x1 = offsetX;
      let x2 = offsetX + lengthHorizontalLine;
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

  drawLastFinalState = () => {
    this.c.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawGrid();
    this.drawExistingBalls();
  };

  drawDroppingBall = col => {
    let dy = 30; // downward velocity of ball
    let halfSpan = this.span / 2;
    let radius = halfSpan - 3;
    let x = this.boardAreaMarginLeft + (2 * col + 1) * halfSpan;
    let y = this.boardAreaMarginTop + halfSpan;
    let distance =
      this.boardAreaMarginTop + this.columnHeight[col] * this.span - halfSpan;
    let player = players[this.connectFour.getCurrentPlayerId()];
    let animate = () => {
      this.drawLastFinalState();
      this.drawNewBall(player, x, y + dy / 2, radius);
      y += dy;
      if (y < distance) requestAnimationFrame(animate);
      else {
        this.ballsInColumn[col].push(new Ball(player, x, distance, radius));
        this.drawLastFinalState();
        if (this.connectFour.isLegalHasWon(this.connectFour.getBoard(player))) {
          this.gameOver = true;
          this.message("message", `${player.name} wins`);
        }
      }
    };
    animate();
    this.columnHeight[col]--;
  };

  drawExistingBalls = () => {
    for (let index = 0; index < this.connectFour.WIDTH; index++) {
      let balls = this.ballsInColumn[index];
      for (let ballIndex = 0; ballIndex < balls.length; ballIndex++) {
        balls[ballIndex].draw(this.c);
      }
    }
  };

  drawNewBall = (player, x, y, radius) => {
    let ball = new Ball(player, x, y, radius);
    ball.draw(this.c);
  };

  message(divName, mesg) {
    const elt = document.getElementById(divName);
    elt.innerText = mesg;
  }
}

export { Game };
