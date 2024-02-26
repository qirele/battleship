import { Board, Ship } from "../logic.js";

let board1;

beforeEach(() => {
  board1 = Board();
});

test("Board places ship of length 4 upwards", () => {
  const s1 = Ship(4);
  board1.placeShip([5, 1], s1, "up");
  expect(board1.board[5][1]).toEqual(s1);
  expect(board1.board[4][1]).toEqual(s1);
  expect(board1.board[3][1]).toEqual(s1);
  expect(board1.board[2][1]).toEqual(s1);
});

test("Board places ship of length 3 to the right", () => {
  const s1 = Ship(3);
  board1.placeShip([2, 3], s1, "right");
  expect(board1.board[2][3]).toEqual(s1);
  expect(board1.board[2][4]).toEqual(s1);
  expect(board1.board[2][5]).toEqual(s1);
});

test("Board places ship of length 2 downwards", () => {
  const s1 = Ship(2);
  board1.placeShip([4, 0], s1, "down");
  expect(board1.board[4][0]).toEqual(s1);
  expect(board1.board[5][0]).toEqual(s1);
});

test("Board places ship of length 4 to the left", () => {
  const s1 = Ship(4);
  board1.placeShip([8, 6], s1, "left");
  expect(board1.board[8][6]).toEqual(s1);
  expect(board1.board[8][5]).toEqual(s1);
  expect(board1.board[8][4]).toEqual(s1);
  expect(board1.board[8][3]).toEqual(s1);
});

test("Board places ship downwards against wall (2)", () => {
  const s1 = Ship(2);
  board1.placeShip([8, 4], s1, "down");
  expect(board1.board[8][4]).toEqual(s1);
  expect(board1.board[9][4]).toEqual(s1);
});

test("Board places ship right(2) against wall", () => {
  const s1 = Ship(2);
  board1.placeShip([7, 8], s1, "right");
  expect(board1.board[7][8]).toEqual(s1);
  expect(board1.board[7][9]).toEqual(s1);
});

test("Board places ship left(2) against wall", () => {
  const s1 = Ship(2);
  board1.placeShip([4, 1], s1, "left");
  expect(board1.board[4][1]).toEqual(s1);
  expect(board1.board[4][0]).toEqual(s1);
});

test("Board throws error when placing ship in the same space", () => {
  const s1 = Ship(2);
  const s2 = Ship(3);
  board1.placeShip([5, 5], s1, "up");

  expect(() => board1.placeShip([5, 5], s2, "left")).toThrow(/already/);
});

test("Board handles ship outside the board", () => {
  const s1 = Ship(2);
  expect(() => board1.placeShip([12, 0], s1, "down")).toThrow(/out of bounds/);
  expect(() => board1.placeShip([5, -1], s1, "up")).toThrow(/out of bounds/);
});

test("Board checks for empty space in board array", () => {
  const s1 = Ship(3);
  board1.placeShip([0, 0], s1, "right");
  expect(board1.board[0][3]).toBe(0);
});

test("Board throws error when two ships are overlapping", () => {
  const s1 = Ship(2);
  const s2 = Ship(3);
  board1.placeShip([4, 4], s1, "right");
  const problemHere = () => board1.placeShip([5, 4], s2, "up");
  expect(problemHere).toThrow(/overlapping/)
});

test("Board handles ships placed too close (1)", () => {
  const s1 = Ship(2);
  const s2 = Ship(3);
  board1.placeShip([1, 2], s1, "down");
  const problemHere = () => board1.placeShip([0, 1], s2, "right");
  expect(problemHere).toThrow(/overlapping/)
});

test("Board handles ships placed too close (2)", () => {
  const s1 = Ship(2);
  const s2 = Ship(3);
  board1.placeShip([3, 3], s1, "left");
  const problemHere = () => board1.placeShip([2, 3], s2, "up");
  expect(problemHere).toThrow(/overlapping/)
});

test("Board handles ships placed too close (3)", () => {
  const s1 = Ship(2);
  const s2 = Ship(3);
  const s3 = Ship(3);
  board1.placeShip([0, 9], s1, "down");
  board1.placeShip([3, 4], s2, "down");
  const problemHere = () => board1.placeShip([2, 7], s3, "left");
  expect(problemHere).toThrow(/overlapping/)
});

test("Board receives attack and calls hit on the proper ship", () => {
  const s1 = Ship(3);
  const spy = jest.spyOn(s1, "hit");
  board1.placeShip([5, 4], s1, "right");
  board1.receiveAttack([5, 5]);

  expect(spy).toHaveBeenCalled();
});

test("receiveAttack handles out of bounds coords", () => {
  expect(() => board1.receiveAttack([-1, 5])).toThrow(/out of bounds/);
});

test("Board receives attack,gets hit, remembers where the ship have been hit", () => {
  const s1 = Ship(3);
  const spy = jest.spyOn(s1, "hit");
  board1.placeShip([3, 1], s1, "right");
  board1.receiveAttack([3, 3]);
  expect(spy).toHaveBeenCalled();
  expect(board1.board[3][3]).toEqual("h");
});

test("Board receives attack, the attack misses, board remembers the missed spot", () => {
  const s1 = Ship(3);
  board1.placeShip([8, 4], s1, "up");
  board1.receiveAttack([5, 4]);
  expect(board1.board[5][4]).toEqual("x");
});

test("Board receives attack on one square multiple times, ignores them", () => {
  const s1 = Ship(3);
  board1.placeShip([8, 4], s1, "up");
  board1.receiveAttack([7, 4]);
  expect(board1.receiveAttack([7, 4])).toBe("ignore");
});

test("Board reports whether all ships have been sunk or not (1)", () => {
  const s1 = Ship(2);
  const s2 = Ship(2);
  const s3 = Ship(2);

  board1.placeShip([1, 1], s1, "right");
  board1.placeShip([3, 1], s2, "right");
  board1.placeShip([5, 1], s3, "right");
  board1.receiveAttack([1, 1]); board1.receiveAttack([1, 2]);
  board1.receiveAttack([3, 1]); board1.receiveAttack([3, 2]);
  board1.receiveAttack([5, 1]); board1.receiveAttack([5, 2]);
  expect(board1.report()).toBe("all ships sunk")
});

test("Board reports whether all ships have been sunk or not (2)", () => {
  const s1 = Ship(2);
  const s2 = Ship(2);
  const s3 = Ship(2);

  board1.placeShip([1, 1], s1, "right");
  board1.placeShip([3, 1], s2, "right");
  board1.placeShip([5, 1], s3, "right");
  board1.receiveAttack([1, 1]); board1.receiveAttack([1, 2]);
  board1.receiveAttack([3, 1]); board1.receiveAttack([3, 2]);
  expect(board1.report()).toBe("not all ships sunk")
});