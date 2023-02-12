import { describe, expect, test } from "@jest/globals";
import { Point2D } from "../Point2D";
import { BoundingBox, CubicBezier, Ellipse, QuadraticBezier } from "../Shape";

describe("testing CubicBezier", () => {
  test("Cubic Bezier curves are in b0, b1, b2, b3 order", () => {
    const P = new CubicBezier(
      new Point2D(1, 1),
      new Point2D(5, 1),
      new Point2D(5, 2),
      new Point2D(4, 2)
    );
    expect(P.b0).toEqual(new Point2D(1, 1));
    expect(P.b1).toEqual(new Point2D(5, 1));
    expect(P.b2).toEqual(new Point2D(5, 2));
    expect(P.b3).toEqual(new Point2D(4, 2));
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
    expect(P.intersectCubicBezier(Q)).toEqual([
      {
        point: new Point2D(3.847050798139925, 1.2784112081094237),
        t: 0.3475500188337186,
      },
    ]);
  });
});

describe("testing QuadraticBezier", () => {
  test("Quadratic Bezier curves are in b0, b1, b2 order", () => {
    const P = new QuadraticBezier(
      new Point2D(23, 24),
      new Point2D(59, 47),
      new Point2D(94, 37)
    );

    expect(P.b0).toEqual(new Point2D(23, 24));
    expect(P.b1).toEqual(new Point2D(59, 47));
    expect(P.b2).toEqual(new Point2D(94, 37));
  });

  test("Quadratic Bezier curve intersections can be calculated", () => {
    const P = new QuadraticBezier(
      new Point2D(23, 24),
      new Point2D(59, 47),
      new Point2D(94, 37)
    );
    const Q = new QuadraticBezier(
      new Point2D(41, 66),
      new Point2D(23, 43),
      new Point2D(71, 10)
    );
    expect(P.intersectQuadraticBezier(Q)).toEqual([
      {
        point: new Point2D(43.4383952995705, 34.429430465203474),
        t: 0.28499468430069186,
      },
    ]);
  });
});

describe("testing Ellipse", () => {
  test("Ellipse are in center, rx, ry order", () => {
    const P = new Ellipse(new Point2D(40, 50), 20, 10);
    expect(P.center).toEqual(new Point2D(40, 50));
    expect(P.rx).toEqual(20);
    expect(P.ry).toEqual(10);
  });

  test("Ellipse BoundingBoxes can be calculated", () => {
    const P_bounding_box = new Ellipse(
      new Point2D(40, 50),
      20,
      10
    ).getBoundingBox();
    expect(P_bounding_box).toEqual(new BoundingBox(20, 40, 40, 20));
  });

  test("Ellipse and Ellipse intersections can be calculated", () => {
    const P = new Ellipse(new Point2D(40, 50), 20, 10);
    const Q = new Ellipse(new Point2D(60, 50), 20, 30);
    expect(P.intersectEllipse(Q)).toEqual([
      {
        point: new Point2D(41.13999063669846, 40.01625794919259),
        t: null,
      },
      {
        point: new Point2D(41.13999063670464, 59.98374205080722),
        t: null,
      },
    ]);
  });

  test("Ellipse can be approximated as 4 Cubic Bezier curves", () => {
    const P = new Ellipse(new Point2D(40, 50), 20, 10);
    expect(P.toBezier()).toEqual([
      new CubicBezier(
        new Point2D(20, 50),
        new Point2D(20, 44.477152000000004),
        new Point2D(28.954304, 40),
        new Point2D(40, 40)
      ),
      new CubicBezier(
        new Point2D(40, 40),
        new Point2D(51.045696, 40),
        new Point2D(60, 44.477152000000004),
        new Point2D(60, 50)
      ),
      new CubicBezier(
        new Point2D(60, 50),
        new Point2D(60, 55.522847999999996),
        new Point2D(51.045696, 60),
        new Point2D(40, 60)
      ),
      new CubicBezier(
        new Point2D(40, 60),
        new Point2D(28.954304, 60),
        new Point2D(20, 55.522847999999996),
        new Point2D(20, 50)
      )
    ]);
  });
});
