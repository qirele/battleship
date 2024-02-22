import { Ship } from "../index.js";

test("Ship has length property of 3", () => {
  const ship1 = Ship(3);
  expect(ship1.length).toBe(3)
});

test("Ship has timesHit property of 0 by default", () => {
  const ship1 = Ship(2);
  expect(ship1.timesHit).toBe(0)
});

test("Ship has hit() function that increases hit number", () => {
  const ship1 = Ship(4);
  ship1.hit();
  expect(ship1.timesHit).toBe(1);
});

test("Ships sinks if hit more than length", () => {
  const ship1 = Ship(2);
  ship1.hit();
  ship1.hit();
  expect(ship1.isSunk()).toBe(true);
});

test("Ships don't sink if hit less than length", () => {
  const ship1 = Ship(2);
  ship1.hit();
  expect(ship1.isSunk()).toBe(false);
});