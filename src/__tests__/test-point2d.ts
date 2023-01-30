import { Point2D } from "../../index";
import { describe, expect, test } from "@jest/globals";

describe("testing Point2D", () => {
  test("No arguments should default to 0, 0", () => {
    const point = new Point2D();
    expect(point.x).toBe(0);
    expect(point.y).toBe(0);
  });

  test("Given arguments are in x, y order", () => {
    const point = new Point2D(1, 2);
    expect(point.x).toBe(1);
    expect(point.y).toBe(2);
  });

  test("One point can be added to another point", () => {
    const point_1 = new Point2D(1, 2);
    const point_2 = new Point2D(3, 4);
    const point_result = new Point2D(4, 6);
    expect(point_1.add(point_2)).toEqual(point_result);
  });

  test("One point can be subtracted from another point", () => {
    const point_1 = new Point2D(3, 2);
    const point_2 = new Point2D(1, 2);
    const point_result = new Point2D(2, 0);
    expect(point_1.subtract(point_2)).toEqual(point_result);
  });

  test("One point can be multiplied by a scalar", () => {
    const point = new Point2D(3, 2);
    const scalar = 3;
    const point_result = new Point2D(9, 6);
    expect(point.multiply(scalar)).toEqual(point_result);
  });

  test("One point can be linearly interpolated with another t amount", () => {
    const point_1 = new Point2D();
    const point_2 = new Point2D(1, 1);
    const t = 0.5;
    const point_result = new Point2D(0.5, 0.5);
    expect(point_1.lerp(point_2, t)).toEqual(point_result);
  });

  test("An error is thrown while linearly interpolating between points when t is not between 0 and 1", () => {
    const point_1 = new Point2D();
    const point_2 = new Point2D(1, 1);
    const t = 2;
    const point_result = new Point2D(0.5, 0.5);
    expect(() => point_1.lerp(point_2, t)).toThrow(RangeError);
    expect(() => point_1.lerp(point_2, t)).toThrow("t must be between 0 and 1");
  });

  test("The point can be represented as a string", () => {
    const point = new Point2D(3, 2);
    expect(point.toString()).toBe("point(3,2)");
  });
});
