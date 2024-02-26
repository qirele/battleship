import { Board, Ship, Player } from '../logic.js';

let board1, board2, player1, player2;

beforeEach(() => {
  board1 = Board();
  board1.placeShip([1, 1], Ship(3), "right"); board1.placeShip([5, 3], Ship(3), "down");
  board2 = Board();
  board2.placeShip([8, 5], Ship(3), "left"); board2.placeShip([3, 0], Ship(3), "up");

  player1 = Player(board1);
  player2 = Player(board2);
});

test("Players get boards assigned to them", () => {
  expect(player1.board[1][1]).toBe(board1.board[1][1]);
  expect(player2.board[8][5]).toBe(board2.board[8][5]);
});

test("Player1 attacks player2, misses", () => {
  const res = player1.attack(player2, [0, 0]);
  expect(res).toBe("miss");
});

test("Player1 attacks player2, hits a ship", () => {
  const res = player1.attack(player2, [2, 0]);
  expect(res).toBe("hit");
});

test("Player.attack handles attacking twice same coord", () => {
  player1.attack(player2, [3, 2]);
  expect(player1.attack(player2, [3, 2])).toBe("twice");
});

test("Player(computer) generates a random play", () => {
  const res = player1.randomPlay();
  expect(res.row).toBeGreaterThanOrEqual(0);
  expect(res.row).toBeLessThanOrEqual(9);
  expect(res.col).toBeGreaterThanOrEqual(0);
  expect(res.col).toBeLessThanOrEqual(9);
});

test("Player(computer) reports that there are no possible moves", () => {
  for (let i = 0; i < 100; i++) {
    player1.randomPlay();
  }
  // 101th play should have no possible moves
  expect(() => player1.randomPlay()).toThrow("no possible moves");
});