import { Matrix2D } from "../src/Matrix2D";
import { Point2D } from "../src/Point2D";
import {
  CubicBezier,
  pathToQuadraticBezier,
  pathToCubicBezier,
  Ellipse,
  Line,
  QuadraticBezier,
} from "../src/Shape";
import { Vector2D } from "../src/Vector2D";

function randomIntFromInterval(min: number, max: number): number {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const width = 3000;
const height = 2000;

const padding = 100;

const mid_line_length = 1.5;

function randomizeEllipses(number_circles: number): Ellipse[] {
  const result: Ellipse[] = [];
  for (let index = 0; index < number_circles; index++) {
    const this_ellipse = new Ellipse(
      new Point2D(randomIntFromInterval(0 + padding, width - padding), randomIntFromInterval(0 + padding, height - padding)),
      randomIntFromInterval(20, 70),
      randomIntFromInterval(20, 70)
    );
    var overlapping = false;
    for (let index = 0; index < result.length; index++) {
      const other_ellipse = result[index];
      if (this_ellipse.getBoundingBox().overlaps(other_ellipse.getBoundingBox())) {
        overlapping = true
      }
    }
    if (!overlapping) {result.push(this_ellipse)}
  }
  return result;
}

console.log(randomizeEllipses(30))

const circle_A = new Ellipse(new Point2D(90, 130), 35, 30);

const circle_B = new Ellipse(new Point2D(250, 70), 40, 20);

const circle_C = new Ellipse(new Point2D(60, 40), 60, 30);

const AB = new Line(circle_A.center, circle_B.center);
const AC = new Line(circle_A.center, circle_C.center);
const BC = new Line(circle_B.center, circle_C.center);

const AB_half_point_between = AB.start.lerp(AB.end, 0.5);
const AB_half_point_between_perpendicular = new Vector2D(
  AB_half_point_between.x,
  AB_half_point_between.y
).perp();
const AC_half_point_between = AC.start.lerp(AC.end, 0.5);
const AC_half_point_between_perpendicular = new Vector2D(
  AC_half_point_between.x,
  AC_half_point_between.y
).perp();
const BC_half_point_between = BC.start.lerp(AC.end, 0.5);
const BC_half_point_between_perpendicular = new Vector2D(
  BC_half_point_between.x,
  BC_half_point_between.y
).perp();

const AB_top_mid_line = AB_half_point_between_perpendicular.perp()
  .divide(mid_line_length)
  .add(new Vector2D(AB_half_point_between.x, AB_half_point_between.y));
const AB_bottom_mid_line = AB_half_point_between_perpendicular.perp()
  .perp()
  .perp()
  .divide(mid_line_length)
  .add(new Vector2D(AB_half_point_between.x, AB_half_point_between.y));
const AC_top_mid_line = AC_half_point_between_perpendicular.perp()
  .divide(mid_line_length)
  .add(new Vector2D(AC_half_point_between.x, AC_half_point_between.y));
const AC_bottom_mid_line = AC_half_point_between_perpendicular.perp()
  .perp()
  .perp()
  .divide(mid_line_length)
  .add(new Vector2D(AC_half_point_between.x, AC_half_point_between.y));
const BC_top_mid_line = BC_half_point_between_perpendicular.perp()
  .divide(mid_line_length)
  .add(new Vector2D(BC_half_point_between.x, BC_half_point_between.y));
const BC_bottom_mid_line = BC_half_point_between_perpendicular.perp()
  .perp()
  .perp()
  .divide(mid_line_length)
  .add(new Vector2D(BC_half_point_between.x, BC_half_point_between.y));

const number_of_anchors = 20;
const AB_anchors: Point2D[] = [];
const AC_anchors: Point2D[] = [];
const BC_anchors: Point2D[] = [];

for (let index = 0; index < number_of_anchors; index++) {
  const t = index / (number_of_anchors - 1);
  AB_anchors.push(
    new Point2D(AB_top_mid_line.x, AB_top_mid_line.y).lerp(
      new Point2D(AB_bottom_mid_line.x, AB_bottom_mid_line.y),
      t
    )
  );
  AC_anchors.push(
    new Point2D(AC_top_mid_line.x, AC_top_mid_line.y).lerp(
      new Point2D(AC_bottom_mid_line.x, AC_bottom_mid_line.y),
      t
    )
  );
  BC_anchors.push(
    new Point2D(BC_top_mid_line.x, BC_top_mid_line.y).lerp(
      new Point2D(BC_bottom_mid_line.x, BC_bottom_mid_line.y),
      t
    )
  );
}

const AB_curves: QuadraticBezier[] = [];
const AC_curves: QuadraticBezier[] = [];
const BC_curves: QuadraticBezier[] = [];
for (let index = 0; index < AB_anchors.length; index++) {
  const anchor = AB_anchors[index];
  AB_curves.push(new QuadraticBezier(circle_A.center, anchor, circle_B.center));
}
for (let index = 0; index < AC_anchors.length; index++) {
  const anchor = AC_anchors[index];
  AC_curves.push(new QuadraticBezier(circle_A.center, anchor, circle_C.center));
}
for (let index = 0; index < BC_anchors.length; index++) {
  const anchor = AC_anchors[index];
  BC_curves.push(new QuadraticBezier(circle_B.center, anchor, circle_C.center));
}

const AB_clean_curves = [];
const AC_clean_curves = [];
const BC_clean_curves = [];
for (let index = 0; index < AB_curves.length; index++) {
  const curve = AB_curves[index];
  const intersections_A = curve.intersectEllipse(circle_A)[0];
  var clean_curve = curve.splitAtParameter(intersections_A.t)[1];
  const intersections_B = clean_curve.intersectEllipse(circle_B)[0];
  clean_curve = clean_curve.splitAtParameter(intersections_B.t)[0];
  AB_clean_curves.push(clean_curve);
}
for (let index = 0; index < AC_curves.length; index++) {
  const curve = AC_curves[index];
  const intersections_A = curve.intersectEllipse(circle_A)[0];
  var clean_curve = curve.splitAtParameter(intersections_A.t)[1];
  const intersections_C = clean_curve.intersectEllipse(circle_C)[0];
  clean_curve = clean_curve.splitAtParameter(intersections_C.t)[0];
  AC_clean_curves.push(clean_curve);
}
for (let index = 0; index < BC_curves.length; index++) {
  const curve = BC_curves[index];
  const intersections_B = curve.intersectEllipse(circle_B)[0];
  var clean_curve = curve.splitAtParameter(intersections_B.t)[1];
  const intersections_C = clean_curve.intersectEllipse(circle_C)[0];
  clean_curve = clean_curve.splitAtParameter(intersections_C.t)[0];
  BC_clean_curves.push(clean_curve);
}

// console.log(`<svg id="Layer_2" data-name="Layer 2"`);
// console.log(
//   `xmlns="http://www.w3.org/2000/svg" width="${width * 2}mm" height="${
//     height * 2
//   }mm" viewBox="0 0 ${width} ${height}">`
// );
// console.log(
//   `<ellipse cx="${circle_A.center.x}" cy="${circle_A.center.y}" rx="${
//     circle_A.rx / 2
//   }" ry="${
//     circle_A.ry / 2
//   }" style="fill: none; stroke: #231f20; stroke-linejoin: round; stroke-width: 4px;"/>`
// );
// console.log(
//   `<ellipse cx="${circle_B.center.x}" cy="${circle_B.center.y}" rx="${
//     circle_B.rx / 2
//   }" ry="${
//     circle_B.ry / 2
//   }" style="fill: none; stroke: #231f20; stroke-linejoin: round; stroke-width: 4px;"/>`
// );
// console.log(
//   `<ellipse cx="${circle_C.center.x}" cy="${circle_C.center.y}" rx="${
//     circle_C.rx / 2
//   }" ry="${
//     circle_C.ry / 2
//   }" style="fill: none; stroke: #231f20; stroke-linejoin: round; stroke-width: 4px;"/>`
// );
// AB_clean_curves.forEach((curve) => {
//   console.log(
//     `<path d="${curve.toString()}" style="fill: none; stroke: #231f20; stroke-linejoin: round; stroke-width: 1px;"/>`
//   );
// });
// AC_clean_curves.forEach((curve) => {
//   console.log(
//     `<path d="${curve.toString()}" style="fill: none; stroke: #231f20; stroke-linejoin: round; stroke-width: 1px;"/>`
//   );
// });
// BC_clean_curves.forEach((curve) => {
//   console.log(
//     `<path d="${curve.toString()}" style="fill: none; stroke: #231f20; stroke-linejoin: round; stroke-width: 1px;"/>`
//   );
// });
// console.log(`</svg>`);
