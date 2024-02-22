import { Board, Ship } from "../index.js";

const s1 = Ship(4);
const s2 = Ship(3);
const s3 = Ship(3);
const s4 = Ship(2);
const s5 = Ship(2);
const s6 = Ship(2);

const mockBoard = [
  [s3, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
  [s3, 0, 0, 0, 0, 0, 0, 0, s2, 0,],
  [s3, 0, 0, 0, s6, 0, 0, 0, s2, 0,],
  [0, 0, 0, 0, s6, 0, 0, 0, s2, 0,],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
  [0, s1, s1, s1, s1, 0, 0, 0, 0, 0,],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
  [0, s4, 0, 0, 0, 0, 0, s5, s5, 0,],
  [0, s4, 0, 0, 0, 0, 0, 0, 0, 0,],
]

test("Board receives attack, calls hit() on the proper ship", () => {
  const board1 = Board(mockBoard);
  const spy = jest.spyOn(s1, "hit");
  board1.receiveAttack([5, 1]);
  expect(spy).toHaveBeenCalled();
});
