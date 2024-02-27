import { Board, Player, Ship } from "./logic.js";

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

  // 1st, remove all listeners, to make sure we arent slowing down our game https://stackoverflow.com/a/4386514
  const clone = computerBoardDiv.cloneNode(true);
  computerBoardDiv.replaceWith(clone);

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
      const player1Verdict = player1.gameboard.report().includes("not all ships sunk");
      const player2Verdict = player2.gameboard.report().includes("not all ships sunk");
      if (!player2Verdict) {
        gameOverScreen("Player1 won");
        return;
      }
      if (!player1Verdict) {
        gameOverScreen("Computer won");
        return;
      }
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

function gameOverScreen(text) {
  // const gameboard1 = Board();
  // gameboard1.placeShip([2, 2], Ship(3), "right");
  // gameboard1.placeShip([4, 2], Ship(3), "down");
  // gameboard1.placeShip([3, 5], Ship(4), "right");
  // const gameboard2 = Board();
  // gameboard2.placeShip([1, 3], Ship(3), "down");
  // gameboard2.placeShip([9, 1], Ship(4), "up");
  // gameboard2.placeShip([3, 6], Ship(3), "left");
  // const player1 = Player(gameboard1);
  // const player2 = Player(gameboard2);
  const body = document.body;
  const gameoverDiv = document.createElement("div");
  gameoverDiv.classList.add("gameover");
  const p = document.createElement("p");
  p.textContent = text;
  gameoverDiv.appendChild(p);
  body.appendChild(gameoverDiv);

  // remove listeners from computerBoardDiv squares
  const computerBoardDiv = document.querySelector(".app > :nth-child(2)");
  const clone = computerBoardDiv.cloneNode(true);
  computerBoardDiv.replaceWith(clone);
}