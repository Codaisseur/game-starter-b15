import Long = require("../node_modules/long");
import { Player } from "./Elements";

/* To read Gilian:
 * http://stackoverflow.com/questions/7044670/how-to-determine-game-end-in-tic-tac-toe/7046415#7046415
 * https://github.com/qu1j0t3/fhourstones/blob/master/Connect4.java
 */
class ConnectFour {
  readonly HEIGHT: number = 6;
  readonly WIDTH: number = 7;
  readonly SIZE: number = this.WIDTH * this.HEIGHT;
  readonly H1: number = this.HEIGHT + 1;
  readonly SIZE1: number = this.WIDTH * this.H1;
  readonly H2: number = this.HEIGHT + 2;
  readonly ALL1: Long = Long.UONE.shl(this.SIZE1).sub(Long.UONE);
  readonly COL1: number = (1 << this.H1) - 1;
  readonly BOTTOM: Long = this.ALL1.div(Long.fromInt(this.COL1, true));
  readonly TOP: Long = this.BOTTOM.shl(this.HEIGHT);

  private color: Long[];
  private height: number[];
  private moves: number[];
  private npiles: number;

  constructor() {
    this.npiles = 0;
    this.color = [];
    this.moves = [];
    this.height = [];
    this.reset();
  }

  reset(): void {
    this.npiles = 0;
    this.color[0] = this.color[1] = Long.UZERO;
    this.moves = [];
    for (let i = 0; i < this.WIDTH; i++) {
      this.height[i] = this.H1 * i;
    }
  }

  getCurrentPlayerId = (): number => {
    return this.npiles & 1;
  };

  getBoard = (player: Player) => {
    return this.color[player.id];
  };

  private isLegal(newboard: Long): boolean {
    return newboard.and(this.TOP).eq(0);
  }

  isPlayable(col: number): boolean {
    return this.isLegal(
      this.color[this.npiles & 1].or(Long.UONE.shl(this.height[col]))
    );
  }

  private hasWon(newboard: Long): boolean {
    let y: Long = newboard.and(newboard.shr(this.HEIGHT));
    if (y.and(y.shr(2 * this.HEIGHT)).neq(Long.UZERO)) {
      return true; // check diagnal \
    }

    y = newboard.and(newboard.shr(this.H1));
    if (y.and(y.shr(2 * this.H1)).neq(Long.UZERO)) {
      return true; // check horizontal -
    }

    y = newboard.and(newboard.shr(this.H2));
    if (y.and(y.shr(2 * this.H2)).neq(Long.UZERO)) {
      return true; // check diagnal /
    }

    y = newboard.and(newboard.shr(1));
    return y.and(y.shr(2)).neq(Long.UZERO); // check vertical |
  }

  isLegalHasWon(newboard: Long): boolean {
    return this.isLegal(newboard) && this.hasWon(newboard);
  }

  move(col: number): void {
    this.color[this.npiles & 1] = this.color[this.npiles & 1].xor(
      Long.UONE.shl(this.height[col])
    );
    this.height[col]++;
    this.moves[this.npiles] = col;
    this.npiles++;
  }
}

export { ConnectFour };
