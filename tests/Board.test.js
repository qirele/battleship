import { Board, Ship } from "../index.js";

test("Board places ship of length 4 upwards", () => {
  const s1 = Ship(4);
  const board1 = Board();
  board1.placeShip([5, 1], s1, "up");
  expect(board1.board[5][1]).toEqual(s1);
  expect(board1.board[4][1]).toEqual(s1);
  expect(board1.board[3][1]).toEqual(s1);
  expect(board1.board[2][1]).toEqual(s1);
});

test("Board places ship of length 3 to the right", () => {
  const s1 = Ship(3);
  const board1 = Board();
  board1.placeShip([2, 3], s1, "right");
  expect(board1.board[2][3]).toEqual(s1);
  expect(board1.board[2][4]).toEqual(s1);
  expect(board1.board[2][5]).toEqual(s1);
});

test("Board places ship of length 2 downwards", () => {
  const s1 = Ship(2);
  const board1 = Board();
  board1.placeShip([4, 0], s1, "down");
  expect(board1.board[4][0]).toEqual(s1);
  expect(board1.board[5][0]).toEqual(s1);
});

test("Board places ship of length 4 to the left", () => {
  const s1 = Ship(4);
  const board1 = Board();
  board1.placeShip([8, 6], s1, "left");
  expect(board1.board[8][6]).toEqual(s1);
  expect(board1.board[8][5]).toEqual(s1);
  expect(board1.board[8][4]).toEqual(s1);
  expect(board1.board[8][3]).toEqual(s1);
});