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

export function Board(board, ships) {
  return {
    receiveAttack: ([row, col]) => {
      board[row][col].hit();
    },
  }
}