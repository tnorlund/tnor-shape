import {Point2D} from "../../index";
import {describe, expect, test} from '@jest/globals';


describe("testing Point2D", () => {
  test("No arguments should default to 0, 0", () => {
    const point = new Point2D();
    expect(point.x).toBe(0);
    expect(point.y).toBe(0);
  });
});
