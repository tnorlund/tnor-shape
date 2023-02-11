import { Point2D } from "../src/Point2D";
import { CubicBezier, pathToQuadraticBezier, pathToCubicBezier } from "../src/Shape";

// const result = pathToQuadraticBezier('m154.33,39.78s8.14,26.32,0,41.64')
const result = pathToCubicBezier(`m61.15,93.59c51.63-18.25,104.51-32.94,158.05-44.43`)


// const P = new CubicBezier(
//   new Point2D(1, 1),
//   new Point2D(5, 1),
//   new Point2D(5, 2),
//   new Point2D(4, 2)
// );
// const Q = new CubicBezier(
//   new Point2D(2, 2),
//   new Point2D(1, 3),
//   new Point2D(3, 3),
//   new Point2D(4, 1)
// );
// const result = P.intersectCubicBezier(Q)
// console.log(result)
