import { Point2D } from "../src/Point2D";
import { CubicBezier } from "../src/Shape";

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
const result = P.intersectCubicBezier(Q)
console.log(result)
