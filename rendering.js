import { Ship } from "./logic.js";

export function renderBoard(gameboard) {
  const appDiv = document.querySelector(".app");
  const boardDiv = document.createElement("div");
  boardDiv.classList.add("board");
  appDiv.appendChild(boardDiv);

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const squareDiv = document.createElement("div");
      squareDiv.classList.add("empty-square");
      if (gameboard.board[i][j] !== 0) {
        squareDiv.classList.add("ship");
      }
      boardDiv.appendChild(squareDiv);
    }
  }
}