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

  const getShipLegalDirections = ([row, col], ship) => {
    const hasSpaceUp = (row - ship.length) >= 0;
    const hasSpaceRight = (col + ship.length) <= 9;
    const hasSpaceDown = (row + ship.length) <= 9;
    const hasSpaceLeft = (col - ship.length) >= 0;
    const directions = [
      hasSpaceUp ? "up" : null,
      hasSpaceRight ? "right" : null,
      hasSpaceDown ? "down" : null,
      hasSpaceLeft ? "left" : null,
    ].filter(el => el !== null);

    return directions;
  };

  const isShipInDirection = ([row, col], direction, length) => {
    switch (direction) {
      case "up": {
        for (let i = 0; i < length; i++) {
          if (board[row - i][col] !== 0) {
            return true;
          }
        }
        break;
      }
      case "right": {
        for (let i = 0; i < length; i++) {
          if (board[row][col + i] !== 0) {
            return true;
          }
        }
        break;
      }
      case "down": {
        for (let i = 0; i < length; i++) {
          if (board[row + i][col] !== 0) {
            return true;
          }
        }
        break;
      }
      case "left": {
        for (let i = 0; i < length; i++) {
          if (board[row][col - i] !== 0) {
            return true;
          }
        }
        break;
      }
      default: return false;
    }
  };

  return {
    placeShip: ([row, col], ship, direction) => {
      if (row < 0 || row > 9 || col < 0 || col > 9)
        throw Error(`[row=${row},col=${col}] out of bounds!`);

      const isThereShip = board[row][col] !== 0;
      if (isThereShip)
        throw Error(`There is a ship already at [${row}][${col}]`);

      const directions = getShipLegalDirections([row, col], ship);
      if (!directions.includes(direction))
        throw Error(`There is no space for a ship in "${direction}"`)

      const isShipOverlapping = isShipInDirection([row, col], direction, ship.length);
      if (isShipOverlapping)
        throw Error(`There is a ship towards ${direction} that causes overlapping`);

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
    get board() {
      return board;
    }
  }
}