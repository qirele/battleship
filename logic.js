export function Ship(length) {
  let timesHit = 0;

  const hit = () => timesHit++;
  const isSunk = () => timesHit === length;

  return {
    length: length,
    get timesHit() {
      return timesHit;
    },
    hit,
    isSunk
  }
}

export function Board() {
  let board = [];
  for (let i = 0; i < 10; i++) {
    let arr = Array(10).fill(0);
    board.push(arr);
  }
  let allShipsSunk = false;
  let addedShips = [];

  const getShipLegalDirections = ([row, col], ship) => {
    const hasSpaceUp = (row - (ship.length - 1)) >= 0;
    const hasSpaceRight = (col + (ship.length - 1)) <= 9;
    const hasSpaceDown = (row + (ship.length - 1)) <= 9;
    const hasSpaceLeft = (col - (ship.length - 1)) >= 0;
    const directions = [
      hasSpaceUp ? "up" : null,
      hasSpaceRight ? "right" : null,
      hasSpaceDown ? "down" : null,
      hasSpaceLeft ? "left" : null,
    ].filter(el => el !== null);

    return directions;
  };

  const _isShipOverlapping = ([row, col], direction, ship) => {
    switch (direction) {
      case "up": {
        for (let i = 0; i < ship.length; i++) {
          const shipInVicinity = _checkVicinities([row - i, col], ship)
          if (shipInVicinity)
            return true;
        }
        break;
      }
      case "right": {
        for (let i = 0; i < ship.length; i++) {
          const shipInVicinity = _checkVicinities([row, col + i], ship)
          if (shipInVicinity)
            return true;
        }
        break;
      }
      case "down": {
        for (let i = 0; i < ship.length; i++) {
          const shipInVicinity = _checkVicinities([row + i, col], ship)
          if (shipInVicinity)
            return true;
        }
        break;
      }
      case "left": {
        for (let i = 0; i < ship.length; i++) {
          const shipInVicinity = _checkVicinities([row, col - i], ship)
          if (shipInVicinity)
            return true;
        }
        break;
      }
      default: return false;
    }

    return false;
  };

  const _outOfBounds = ([row, col]) => {
    return row < 0 || row > 9 || col < 0 || col > 9;
  }

  const _checkVicinities = ([row, col], ship) => {
    let legalSquares = [];
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        legalSquares.push(_outOfBounds([row + i, col + j]) ? null : [row + i, col + j])
      }
    }
    legalSquares = legalSquares.filter(el => el !== null);

    const isThereShip = legalSquares.some(([i, j]) => {
      const square = board[i][j];
      return square !== 0 && square !== ship;
    });

    return isThereShip;
  }

  const _areAllShipsSunk = () => {
    return addedShips.every(el => el.ship.timesHit === el.ship.length);
  }

  return {
    placeShip: ([row, col], ship, direction) => {
      if (_outOfBounds([row, col]))
        throw Error(`[row=${row},col=${col}] out of bounds!`);

      const isThereShip = board[row][col] !== 0;
      if (isThereShip)
        throw Error(`There is a ship already at [${row}][${col}]`);

      const directions = getShipLegalDirections([row, col], ship);
      if (!directions.includes(direction))
        throw Error(`There is no space for a ship in "${direction}"${row} ${col}`)

      const isShipOverlapping = _isShipOverlapping([row, col], direction, ship);
      if (isShipOverlapping)
        throw Error(`There is a ship in the vicinity that causes overlapping`);

      addedShips.push({ ship, direction });

      switch (direction) {
        case "up": {
          for (let i = 0; i < ship.length; i++) {
            board[row - i][col] = ship;
          }
          break;
        }
        case "right": {
          for (let i = 0; i < ship.length; i++) {
            board[row][col + i] = ship;
          }
          break;
        }
        case "down": {
          for (let i = 0; i < ship.length; i++) {
            board[row + i][col] = ship;
          }
          break;
        }
        case "left": {
          for (let i = 0; i < ship.length; i++) {
            board[row][col - i] = ship;
          }
          break;
        }
      }
    },
    receiveAttack: ([row, col]) => {
      if (_outOfBounds([row, col]))
        throw Error("Provided coords out of bounds");

      const square = board[row][col];

      if (square === "h" || square === "x")
        return "ignore";

      if (square !== 0) {
        square.hit();
        if (_areAllShipsSunk())
          allShipsSunk = true;

        board[row][col] = "h";
      } else {
        board[row][col] = "x";
      }
    },
    report: () => {
      return allShipsSunk ? "all ships sunk" : "not all ships sunk";
    },
    get board() {
      return board;
    },
    getShipLegalDirections
  }
}

export function Player(board) {
  const possibleMoves = [];
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      possibleMoves.push([i, j]);
    }
  }

  return {
    gameboard: board,
    board: board.board,
    attack: (opponent, [row, col]) => {
      const opponentSquare = opponent.board[row][col];
      if (opponentSquare === "x" || opponentSquare === "h") {
        return "twice";
      }
      opponent.gameboard.receiveAttack([row, col])
      if (opponent.board[row][col] === "x") return "miss";
      if (opponent.board[row][col] === "h") return "hit";
    },
    randomPlay: () => {
      if (possibleMoves.length === 0)
        throw Error("no possible moves");
      const idx = Math.floor(Math.random() * possibleMoves.length);
      const [row, col] = possibleMoves[idx];
      possibleMoves.splice(idx, 1);

      return { row, col };
    }
  }
}