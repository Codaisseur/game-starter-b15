import Game = require("./Game");

(function() {
  let game = new Game();
  game.start();

  document.getElementById("restart").addEventListener("click", () => {
    game.reset();
    game.message("message", "");
  });
})();
