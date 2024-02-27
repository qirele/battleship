import { Board, Player, Ship } from "./logic.js";
import { render, attachListeners } from './rendering.js';

(() => {
  const gameboard1 = Board();
  gameboard1.placeShip([1, 1], Ship(3), "right");
  gameboard1.placeShip([5, 3], Ship(3), "down");
  gameboard1.placeShip([3, 5], Ship(4), "right");
  const gameboard2 = Board();
  gameboard2.placeShip([0, 3], Ship(3), "down");
  gameboard2.placeShip([9, 0], Ship(4), "up");
  gameboard2.placeShip([4, 8], Ship(3), "left");
  const player1 = Player(gameboard1);
  const player2 = Player(gameboard2);
  render(gameboard1, gameboard2);

  attachListeners(player1, player2);


})();