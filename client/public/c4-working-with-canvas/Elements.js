class Player {
  constructor(id, name, color, columnHighlightingColor) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.columnHighlightingColor = columnHighlightingColor;
  }
}

class Ball {
  constructor(player, x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = player.color;
  }

  draw = context => {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, 2 * this.pi);
    context.fillStyle = this.color;
    context.fill();
    context.closePath();
  };
}

let player1 = new Player(0, "GILIAN", "red", "rgba(255, 204, 204, 0.2)");
let player2 = new Player(1, "BRIDGET", "blue", "rgba(204, 204, 255, 0.2)");

export { Player };
export let players = [player1, player2];
export { Ball };
