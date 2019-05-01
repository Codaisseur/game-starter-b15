import "mocha";
import { equal } from "assert";
import { calculateWinner } from "./logic";
import { Board } from "./entities";

// , isValidTransition, finished

describe("calculateWinner()", () => {
  it("should work for a horizontal winner", () => {
    const board: Board = [
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, "o", "o", null, null, null],
      [null, null, "o", "x", "x", "x", "x"]
    ];
    equal(calculateWinner(board), "x");
  });

  it("should work for a vertical winner", () => {
    const board: Board = [
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, "o"],
      [null, null, null, null, null, null, "o"],
      [null, null, null, null, null, null, "o"],
      [null, "x", "x", null, null, "x", "o"]
    ];
    equal(calculateWinner(board), "o");
  });

  it("should work for a diagonal winner [rtl]", () => {
    const board: Board = [
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, "x", null],
      [null, null, null, null, "x", "o", null],
      [null, null, null, "x", "x", "o", "o"],
      [null, null, "x", "o", "o", "o", "x"]
    ];
    equal(calculateWinner(board), "x");
  });

  it("should work for a diagonal winner [ltr]", () => {
    const board: Board = [
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, "o", null, null, null, null, null],
      [null, "x", "o", null, null, null, null],
      ["x", "x", "o", "o", null, null, null],
      ["o", "x", "x", "x", "o", null, null]
    ];
    equal(calculateWinner(board), "o");
  });

  // it("should work when there is no winner", () => {
  //   const board: Board = [
  //     ["o", "x", "o", "x", "o", "x", "o"],
  //     ["x", "o", "x", "o", "x", "o", "x"],
  //     ["x", "o", "x", "o", "x", "o", "x"],
  //     ["o", "x", "o", "x", "o", "x", "o"],
  //     ["o", "x", "o", "x", "o", "x", "o"],
  //     ["x", "o", "x", "o", "x", "o", "x"]
  //   ];
  //   equal(calculateWinner(board), null);
  // });

  //   it("should work when the board is empty", () => {
  //     const board: Board = [
  //       [null, null, null, null, null, null, null],
  //       [null, null, null, null, null, null, null],
  //       [null, null, null, null, null, null, null],
  //       [null, null, null, null, null, null, null],
  //       [null, null, null, null, null, null, null],
  //       [null, null, null, null, null, null, null]
  //     ];
  //     equal(calculateWinner(board), null);
  //   });
  // });

  // describe("isValidTransition()", () => {
  //   it("should allow for a move from x", () => {
  //     const from: Board = [
  //       [null, null, null, null, null, null, null],
  //       [null, null, null, null, null, null, null],
  //       [null, null, null, null, null, null, null],
  //       [null, null, null, null, null, null, null],
  //       [null, null, "o", "o", null, null, null],
  //       [null, null, "o", "x", "x", "x", null]
  //     ];
  //     const to: Board = [
  //       [null, null, null, null, null, null, null],
  //       [null, null, null, null, null, null, null],
  //       [null, null, null, null, null, null, null],
  //       [null, null, null, null, null, null, null],
  //       [null, null, "o", "o", null, null, null],
  //       [null, null, "o", "x", "x", "x", "x"]
  //     ];
  //     equal(isValidTransition("x", from, to), true);
  //   });

  //   it("should allow for a move from o", () => {
  //     const from: Board = [
  //       [null, null, null, null, null, null, null],
  //       [null, null, null, null, null, null, null],
  //       [null, null, null, null, null, null, null],
  //       [null, null, null, null, null, null, "o"],
  //       [null, null, null, null, null, null, "o"],
  //       [null, "x", "x", null, null, "x", "o"]
  //     ];
  //     const to: Board = [
  //       [null, null, null, null, null, null, null],
  //       [null, null, null, null, null, null, null],
  //       [null, null, null, null, null, null, "o"],
  //       [null, null, null, null, null, null, "o"],
  //       [null, null, null, null, null, null, "o"],
  //       [null, "x", "x", null, null, "x", "o"]
  //     ];
  //     equal(isValidTransition("o", from, to), true);
  //   });

  //   it("should not allow to overwrite", () => {
  //     const from: Board = [
  //       // ['o', null, null],
  //       // [null, 'x', 'o'],
  //       // ['x', 'o', 'o'],

  //       [null, null, null, null, null, null, null],
  //       [null, null, null, null, null, null, null],
  //       [null, null, null, null, null, null, null],
  //       [null, null, null, null, "o", null, null],
  //       [null, null, null, "x", "x", "o", "o"],
  //       [null, null, "x", "o", "o", "o", "x"]
  //     ];
  //     const to: Board = [
  //       // ['o', null, null],
  //       // [null, 'x', 'o'],
  //       // ['x', 'o', 'x'],

  //       [null, null, null, null, null, null, null],
  //       [null, null, null, null, null, null, null],
  //       [null, null, null, null, null, null, null],
  //       [null, null, null, null, "x", null, null],
  //       [null, null, null, "x", "x", "o", "o"],
  //       [null, null, "x", "o", "o", "o", "x"]
  //     ];
  //     equal(isValidTransition("x", from, to), false);
  //   });

  //   it("should not allow to do more than 1 change", () => {
  //     const from: Board = [
  //       // ['o', null, null],
  //       // [null, 'x', 'o'],
  //       // ['x', 'o', 'o'],
  //       [null, null, null, null, null, null, null],
  //       [null, null, null, null, null, null, null],
  //       [null, null, null, null, null, null, null],
  //       [null, "o", null, null, null, null, null],
  //       ["x", "x", "o", "o", null, null, null],
  //       ["o", "x", "x", "x", "o", null, null]
  //     ];
  //     const to: Board = [
  //       // ['o', 'x', 'x'],
  //       // [null, 'x', 'o'],
  //       // ['x', 'o', 'o'],

  //       [null, null, null, null, null, null, null],
  //       [null, null, null, null, null, null, null],
  //       ["o", null, null, null, null, null, null],
  //       ["o", "o", null, null, null, null, null],
  //       ["x", "x", "o", "o", null, null, null],
  //       ["o", "x", "x", "x", "o", null, null]
  //     ];
  //     equal(isValidTransition("x", from, to), false);
  //   });

  //   it("should not allow to do more than 1 change even if 1 is valid", () => {
  //     const from: Board = [
  //       // ['x', null, null],
  //       // [null, 'o', 'x'],
  //       // ['o', 'x', 'x'],

  //       [null, null, null, null, null, null, null],
  //       [null, null, null, null, null, null, null],
  //       [null, null, null, null, null, null, null],
  //       ["x", "x", null, null, null, null, null],
  //       ["x", "o", "x", "x", null, null, null],
  //       ["x", "o", "o", "o", "o", "x", null]
  //     ];
  //     const to: Board = [
  //       // ['x', null, 'x'],
  //       // [null, 'o', 'x'],
  //       // [null, 'x', 'x'],

  //       [null, null, null, null, null, null, null],
  //       [null, null, null, null, null, null, null],
  //       ["x", null, null, null, null, null, null],
  //       ["x", "x", null, null, null, null, null],
  //       ["x", "o", "x", "x", null, null, null],
  //       ["x", "o", "o", "o", null, "x", null]
  //     ];
  //     equal(isValidTransition("o", from, to), false);
  //   });
  // });

  // describe("finished()", () => {
  //   it("should finish when there are no moves left", () => {
  //     const board: Board = [
  //       ["o", "x", "o", "x", "o", "x", "o"],
  //       ["x", "o", "x", "o", "x", "o", "x"],
  //       ["x", "o", "x", "o", "x", "o", "x"],
  //       ["o", "x", "o", "x", "o", "x", "o"],
  //       ["o", "x", "o", "x", "o", "x", "o"],
  //       ["x", "o", "x", "o", "x", "o", "x"]
  //   ];
  //     equal(finished(board), true);
  //   });

  //   it("should not finish when there are moves left", () => {
  //     const board: Board = [
  //       ["o", "x", "o", null, "o", "x", null],
  //       ["x", "o", "x", "o", "x", "o", "x"],
  //       ["x", "o", "x", "o", "x", "o", "x"],
  //       ["o", "x", "o", "x", "o", "x", "o"],
  //       ["o", "x", "o", "x", "o", "x", "o"],
  //       ["x", "o", "x", "o", "x", "o", "x"]
  //     ];
  //     equal(finished(board), false);
  //   });
});
