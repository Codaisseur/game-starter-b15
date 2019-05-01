import Long from "long";
import { Player } from "./Elements";
import { players } from "./Elements";

class ConnectFour {
  HEIGHT = 6;
  WIDTH = 7;
  SIZE = this.WIDTH * this.HEIGHT;
  H1 = this.HEIGHT + 1;
  SIZE1 = this.WIDTH * this.H1;
  H2 = this.HEIGHT + 2;
  ALL1 = Long.UONE.shl(this.SIZE1).sub(Long.UONE);
  COL1 = (1 << this.H1) - 1;
  BOTTOM = this.ALL1.div(Long.fromInt(this.COL1, true));
  TOP = this.BOTTOM.shl(this.HEIGHT);

  constructor() {
    this.npiles = 0;
    this.color = [];
    this.moves = [];
    this.height = [];
    this.reset();
  }

  reset() {
    this.npiles = 0;
    this.color[0] = this.color[1] = Long.UZERO;
    this.moves = [];
    for (let i = 0; i < this.WIDTH; i++) {
      this.height[i] = this.H1 * i;
    }
  }

  getCurrentPlayerId = () => {
    return this.npiles & 1;
  };

  getBoard = player => {
    return this.color[player.id];
  };

  isLegal(newboard) {
    return newboard.and(this.TOP).eq(0);
  }

  isPlayable(col) {
    return this.isLegal(
      this.color[this.npiles & 1].or(Long.UONE.shl(this.height[col]))
    );
  }

  hasWon(newboard) {
    let y = newboard.and(newboard.shr(this.HEIGHT));
    if (y.and(y.shr(2 * this.HEIGHT)).neq(Long.UZERO)) {
      return true; // check diagonal \ rtl
    }

    y = newboard.and(newboard.shr(this.H1));
    if (y.and(y.shr(2 * this.H1)).neq(Long.UZERO)) {
      return true; // check horizontal -
    }

    y = newboard.and(newboard.shr(this.H2));
    if (y.and(y.shr(2 * this.H2)).neq(Long.UZERO)) {
      return true; // check diagonal / ltr
    }

    y = newboard.and(newboard.shr(1));
    return y.and(y.shr(2)).neq(Long.UZERO); // check vertical |
  }

  isLegalHasWon(newboard) {
    return this.isLegal(newboard) && this.hasWon(newboard);
  }

  move(col) {
    this.color[this.npiles & 1] = this.color[this.npiles & 1].xor(
      Long.UONE.shl(this.height[col])
    );
    this.height[col]++;
    this.moves[this.npiles] = col;
    this.npiles++;
  }
}

export { ConnectFour };
