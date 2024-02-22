import { Board, Ship } from "../index.js";

const mockShip = Ship(3)
const mockBoard = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
  [0, mockShip, mockShip, mockShip, 0, 0, 0, 0, 0, 0,],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
]

test("Board receives attack, calls hit() on the proper ship", () => {
  const board1 = Board(mockBoard);
  board1.receiveAttack([5, 1]);
  const ship = board1.board[5][1];
  ship.hit();
  expect(ship.timesHit).toBe(1);
});