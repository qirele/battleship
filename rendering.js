import { Board, Player, Ship } from "./logic.js";

export function render(player1, player2) {
  const appDiv = document.querySelector(".app");
  while (appDiv.firstChild) {
    appDiv.removeChild(appDiv.firstChild);
  }
  renderBoard(player1);
  renderBoard(player2);
}

function renderBoard(player) {
  const gameboard = player.player.gameboard;
  const playerName = player.name;
  const appDiv = document.querySelector(".app");
  const boardDiv = document.createElement("div");
  boardDiv.classList.add("board");
  boardDiv.classList.add(playerName === "Computer" ? "computer-board" : "player-board");
  appDiv.appendChild(boardDiv);

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const squareDiv = document.createElement("div");
      const span = document.createElement("span");
      if (i === 0) {
        span.textContent = j;
        span.classList.add("number-up");
      }
      if (j === 0) {
        span.textContent = i;
        span.classList.add("number-left");
      }
      squareDiv.appendChild(span);
      if (i === 0 && j === 0) {
        const secondSpan = document.createElement("span");
        secondSpan.textContent = 0;
        secondSpan.classList.add("number-up");
        squareDiv.appendChild(secondSpan);
      }
      squareDiv.classList.add("square");
      if (typeof gameboard.board[i][j] === "object" && playerName === "Player") {
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

export function attachSquareListeners(player1, player2) {
  const playerBoardDiv = document.querySelector(".app > :nth-child(1)");
  const computerBoardDiv = document.querySelector(".app > :nth-child(2)");
  let isPlayer1Move = true;
  playerBoardDiv.classList.add((isPlayer1Move ? "attacking" : "receiving"));
  playerBoardDiv.classList.remove((isPlayer1Move ? "receiving" : "attacking"));
  computerBoardDiv.classList.add((isPlayer1Move ? "receiving" : "attacking"));
  computerBoardDiv.classList.remove((isPlayer1Move ? "attacking" : "receiving"));

  // 1st, remove all listeners, to make sure we arent slowing down our game https://stackoverflow.com/a/4386514
  const clone = computerBoardDiv.cloneNode(true);
  computerBoardDiv.replaceWith(clone);

  const computerSquares = document.querySelectorAll(".app > :nth-child(2) div")
  computerSquares.forEach(square => {
    square.addEventListener("click", (el) => {
      const rowIdx = Number(el.target.dataset.row);
      const colIdx = Number(el.target.dataset.col);
      const result = player2.gameboard.receiveAttack([rowIdx, colIdx])
      if (result === "ignore")
        return;

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
  playerBoardDiv.classList.add((isPlayer1Move ? "attacking" : "receiving"));
  playerBoardDiv.classList.remove((isPlayer1Move ? "receiving" : "attacking"));
  computerBoardDiv.classList.add((isPlayer1Move ? "receiving" : "attacking"));
  computerBoardDiv.classList.remove((isPlayer1Move ? "attacking" : "receiving"));


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
    }
  });

  if (coords !== undefined) {
    const { row, col } = coords;
    const square = playerBoardDiv.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    square.classList.add("animating");
  }

  compSquares.forEach(sq => {
    const [i, j] = [sq.dataset.row, sq.dataset.col];
    // if (typeof player2.board[i][j] === "object") {
    //   sq.className = "square ship"
    // }
    if (player2.board[i][j] === "h") {
      sq.className = "square ship hit";
    }
    if (player2.board[i][j] === "x") {
      sq.className = "square miss";
    }
  });

}

function gameOverScreen(text) {
  const body = document.body;
  const gameoverDiv = document.createElement("div");
  gameoverDiv.classList.add("gameover");
  const p = document.createElement("p");
  p.textContent = text;
  const startBtn = document.createElement("button");
  startBtn.textContent = "Play Again";
  startBtn.classList.add("start-btn");
  gameoverDiv.appendChild(p);
  gameoverDiv.appendChild(startBtn);
  body.appendChild(gameoverDiv);

  // remove listeners from computerBoardDiv squares
  const computerBoardDiv = document.querySelector(".app > :nth-child(2)");
  const clone = computerBoardDiv.cloneNode(true);
  computerBoardDiv.replaceWith(clone);

  startBtn.addEventListener("click", () => {
    startScreen();
    gameoverDiv.remove();
  });
}

export function startScreen() {
  // Hello. To start a new game, choose coords to place your ships 
  // first render the two boards
  // placeShip(coords, ship(4), direction)
  // after each placement, rerender the boards
  const gameboard1 = Board();
  const gameboard2 = Board();
  const player1 = Player(gameboard1);
  const player2 = Player(gameboard2);
  render({ player: player1, name: "Player" }, { player: player2, name: "Computer" });

  const startDiv = document.createElement("div");
  startDiv.className = "startscreen";
  const p1 = document.createElement("p");
  p1.textContent = "Type coords for each of your ship";

  const div1 = createInput("row");
  const div2 = createInput("col");

  const select1 = createSelect("directions");

  let shipLength = 4;
  const btn1 = document.createElement("button");
  btn1.textContent = "Place Ship";
  btn1.addEventListener("click", () => {
    if (shipLength === 1) {
      console.log("Youre done generating ships.");
      return;
    }
    const rowIdx = Number(document.querySelector("#row").value);
    const colIdx = Number(document.querySelector("#col").value);
    const selectValue = document.querySelector("#directions").value;
    player1.gameboard.placeShip([rowIdx, colIdx], Ship(shipLength), selectValue);
    render({ player: player1, name: "Player" }, { player: player2, name: "Computer" });
    shipLength--;
    if (shipLength === 1) {
      generateRandomShipsFor(player2);
      render({ player: player1, name: "Player" }, { player: player2, name: "Computer" });
      const btn = generateStartBtn();
      btn.addEventListener("click", () => {
        attachSquareListeners(player1, player2);
        startDiv.remove();
      });
    }
  });
  const btn2 = document.createElement("button");
  btn2.textContent = "Place Random Ship";


  startDiv.appendChild(p1);
  startDiv.appendChild(div1);
  startDiv.appendChild(div2);
  startDiv.appendChild(select1);
  startDiv.appendChild(btn1);
  startDiv.appendChild(btn2);
  document.body.appendChild(startDiv);
}


function createInput(id) {
  const div1 = document.createElement("div");
  div1.className = "input-wrapper";
  const label1 = document.createElement("label");
  const input1 = document.createElement("input");
  input1.id = id;
  label1.htmlFor = id;
  label1.textContent = `${id}: `;
  div1.appendChild(label1);
  div1.appendChild(input1);
  return div1;
}

function createSelect(id) {
  const div1 = document.createElement("div");
  div1.className = "input-wrapper";
  const label1 = document.createElement("label");
  label1.htmlFor = id;
  label1.textContent = "Choose direction: ";
  const select = document.createElement("select")
  select.id = id;
  const createOption = (direction) => {
    const option = document.createElement("option");
    option.value = direction;
    option.textContent = direction;
    return option;
  }
  const directions = ["up", "right", "down", "left"];
  directions.forEach(direction => select.appendChild(createOption(direction)));

  div1.appendChild(label1);
  div1.appendChild(select);
  return div1;
}

function generateRandomShipsFor(player) {
  let shipLength = 4;
  while (shipLength > 1) {
    const rowIdx = Math.floor(Math.random() * 10);
    const colIdx = Math.floor(Math.random() * 10);
    const dirs = player.gameboard.getShipLegalDirections([rowIdx, colIdx], { length: shipLength });
    const dirIdx = Math.floor(Math.random() * dirs.length);
    try {
      player.gameboard.placeShip([rowIdx, colIdx], Ship(shipLength), dirs[dirIdx])
    } catch (err) {
      console.log(err);
      continue;
    }
    shipLength--;
  }
}

function generateStartBtn() {
  const btn = document.createElement("button");
  btn.classList.add("start-btn");
  btn.textContent = "Start Game";
  const startScreenDiv = document.querySelector(".startscreen");
  startScreenDiv.replaceChildren();
  startScreenDiv.appendChild(btn);
  return btn;
}
