import { Ship } from "./logic.js";

export function render(gameboard1, gameboard2) {
  const appDiv = document.querySelector(".app");
  while (appDiv.firstChild) {
    appDiv.removeChild(appDiv.firstChild);
  }
  renderBoard(gameboard1);
  renderBoard(gameboard2);
}

function renderBoard(gameboard) {
  const appDiv = document.querySelector(".app");
  const boardDiv = document.createElement("div");
  boardDiv.classList.add("board");
  appDiv.appendChild(boardDiv);

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const squareDiv = document.createElement("div");
      squareDiv.classList.add("square");
      if (typeof gameboard.board[i][j] === "object") {
        squareDiv.classList.add("ship");
      }
      if (gameboard.board[i][j] === "h") {
        squareDiv.classList.add("hit");
      }
      if (gameboard.board[i][j] === "x") {
        squareDiv.classList.add("miss");
        squareDiv.textContent = "X";
      }
      squareDiv.dataset.row = i;
      squareDiv.dataset.col = j;
      boardDiv.appendChild(squareDiv);
    }
  }
}

export function attachListeners(player1, player2) {
  const playerBoardDiv = document.querySelector(".app > :nth-child(1)");
  const computerBoardDiv = document.querySelector(".app > :nth-child(2)");
  let isPlayer1Move = true;
  playerBoardDiv.className = (isPlayer1Move ? "board attacking" : "board receiving");
  computerBoardDiv.className = (isPlayer1Move ? "board receiving" : "board attacking");

  const computerSquares = document.querySelectorAll(".app > :nth-child(2) div")
  computerSquares.forEach(square => {
    square.addEventListener("click", (el) => {
      const rowIdx = Number(el.target.dataset.row);
      const colIdx = Number(el.target.dataset.col);
      player2.gameboard.receiveAttack([rowIdx, colIdx])
      isPlayer1Move = !isPlayer1Move;
      rerender(player1, player2, isPlayer1Move);
      const sleep = ms => new Promise(r => setTimeout(r, ms));
      sleep(300)
        .then(() => {
          // computer makes move 
          const coords = player2.randomPlay();
          player2.attack(player1, [coords.row, coords.col]);
          isPlayer1Move = !isPlayer1Move;
          rerender(player1, player2, isPlayer1Move, coords);
        })
    });
  });
}

function rerender(player1, player2, isPlayer1Move, coords) {
  const playerSquares = document.querySelectorAll(".app > :nth-child(1) div");
  const compSquares = document.querySelectorAll(".app > :nth-child(2) div");
  const playerBoardDiv = document.querySelector(".app > :nth-child(1)");
  const computerBoardDiv = document.querySelector(".app > :nth-child(2)");
  playerBoardDiv.className = (isPlayer1Move ? "board attacking" : "board receiving");
  computerBoardDiv.className = (isPlayer1Move ? "board receiving" : "board attacking");


  playerSquares.forEach(sq => {
    const [i, j] = [sq.dataset.row, sq.dataset.col];
    if (typeof player1.board[i][j] === "object") {
      sq.className = "square ship"
    }
    if (player1.board[i][j] === "h") {
      sq.className = "square ship hit";
    }
    if (player1.board[i][j] === "x") {
      sq.className = "square miss";
      // sq.textContent = "X";
    }
  });

  if (coords !== undefined) {
    const { row, col } = coords;
    const square = playerBoardDiv.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    square.classList.add("animating");
  }

  compSquares.forEach(sq => {
    const [i, j] = [sq.dataset.row, sq.dataset.col];
    if (typeof player2.board[i][j] === "object") {
      sq.className = "square ship"
    }
    if (player2.board[i][j] === "h") {
      sq.className = "square ship hit";
    }
    if (player2.board[i][j] === "x") {
      sq.className = "square miss";
      // sq.textContent = "X";
    }
  });

}