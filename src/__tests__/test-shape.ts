import { describe, expect, test } from "@jest/globals";
import { Point2D } from "../Point2D";
import { CubicBezier } from "../Shape";

describe("testing CubicBezier", () => {
  test("Cubic Bezier curves are in b0, b1, b2, b3 order", () => {
    const P = new CubicBezier(
      new Point2D(1, 1),
      new Point2D(5, 1),
      new Point2D(5, 2),
      new Point2D(4, 2)
    );
    expect(P.b0).toEqual(new Point2D(1, 1))
    expect(P.b1).toEqual(new Point2D(5, 1))
    expect(P.b2).toEqual(new Point2D(5, 2))
    expect(P.b3).toEqual(new Point2D(4, 2))
  });

  test("Cubic Bezier curve intersections can be calculated", () => {
    const P = new CubicBezier(
        new Point2D(1, 1),
        new Point2D(5, 1),
        new Point2D(5, 2),
        new Point2D(4, 2)
      );
      const Q = new CubicBezier(
        new Point2D(2, 2),
        new Point2D(1, 3),
        new Point2D(3, 3),
        new Point2D(4, 1)
      );
      expect(P.intersectCubicBezier(Q)).toEqual([{point: new Point2D(3.847050798139925,1.2784112081094237), t:0.3475500188337186}])
  })
});
