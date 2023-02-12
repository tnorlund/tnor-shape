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

const DEBUG = false;

const width = 3000;
const height = 2000;

const padding = 100;

const mid_line_length = 1.5;

function randomizeEllipses(number_circles: number): Ellipse[] {
  const result: Ellipse[] = [];
  for (let index = 0; index < number_circles; index++) {
    const this_ellipse = new Ellipse(
      new Point2D(
        randomIntFromInterval(0 + padding, width - padding),
        randomIntFromInterval(0 + padding, height - padding)
      ),
      randomIntFromInterval(20, 70),
      randomIntFromInterval(20, 70)
    );
    var overlapping = false;
    for (let index = 0; index < result.length; index++) {
      const other_ellipse = result[index];
      if (
        this_ellipse.getBoundingBox().overlaps(other_ellipse.getBoundingBox())
      ) {
        overlapping = true;
      }
    }
    if (!overlapping) {
      result.push(this_ellipse);
    }
  }
  return result;
}

const ellipses = randomizeEllipses(15);

const circle_A = new Ellipse(new Point2D(90, 130), 35, 30);

const circle_B = new Ellipse(new Point2D(250, 70), 40, 20);

const circle_C = new Ellipse(new Point2D(60, 40), 60, 30);

interface NodeEdges {
  ellipse_A: Ellipse;
  ellipse_B: Ellipse;
  line: Line;
}
function linesBetweenEllipses(ellipses: Ellipse[]): NodeEdges[] {
  const result: NodeEdges[] = [];
  for (let index = 0; index < ellipses.length; index++) {
    const this_ellipse = ellipses[index];
    // for each ellipse determine if the line between it and other
    // ellipses are overlapping
    for (
      let outer_index = index + 1;
      outer_index < ellipses.length;
      outer_index++
    ) {
      const that_ellipse = ellipses[outer_index];
      const line = new Line(this_ellipse.center, that_ellipse.center);
      var overlapping = false;
      // if (outer_index)
      for (
        let overlapping_index = 0;
        overlapping_index < ellipses.length;
        overlapping_index++
      ) {
        const overlapping_ellipse = ellipses[overlapping_index];
        // console.log(`line: ${index}-${outer_index} overlaps ${overlapping_index}? ${overlapping_ellipse.getBoundingBox().overlaps(line.getBoundingBox())}`)
        // compare against all ellipses and ensure that this ellipse and
        // that ellipse are not being checked against.
        if (
          overlapping_ellipse
            .getBoundingBox()
            .overlaps(line.getBoundingBox()) &&
          overlapping_index != index &&
          overlapping_index != outer_index
        ) {
          overlapping = true;
        }
      }
      if (!overlapping) {
        result.push({
          ellipse_A: this_ellipse,
          ellipse_B: that_ellipse,
          line: line,
        });
      }
    }
  }

  return result;
}

const node_edges = linesBetweenEllipses(ellipses);

interface edgeCurves {
  mid_Point: Point2D;
  tangent: Line;
  anchors: Point2D[];
  curves: QuadraticBezier[];
}

function createEdgeCurves(node_edges: NodeEdges[]): edgeCurves[] {
  const result: edgeCurves[] = [];
  for (let index = 0; index < node_edges.length; index++) {
    const ellipse_A = node_edges[index].ellipse_A;
    const ellipse_B = node_edges[index].ellipse_B;
    const line = node_edges[index].line;
    const mid_point = line.start.lerp(line.end, 0.5);
    const matrix = new Matrix2D();
    const lerp_length = randomIntFromInterval(1, 5) / 10;
    const tangent_endpoint = mid_point
      .lerp(line.end, lerp_length)
      .transform(matrix.rotationAt(Math.PI / 2, mid_point));
    const tangent_startpoint = mid_point
      .lerp(line.end, lerp_length)
      .transform(matrix.rotationAt(-Math.PI / 2, mid_point));
    const number_anchors = 2 * randomIntFromInterval(5, 10);
    const anchors = [];
    for (let index = 0; index < number_anchors; index++) {
      const t = index / (number_anchors - 1);
      anchors.push(
        new Point2D(tangent_startpoint.x, tangent_startpoint.y).lerp(
          new Point2D(tangent_endpoint.x, tangent_endpoint.y),
          t
        )
      );
    }
    const clean_curves: QuadraticBezier[] = [];
    for (let index = 0; index < anchors.length; index++) {
      const anchor = anchors[index];
      var curve = new QuadraticBezier(
        ellipse_A.center,
        anchor,
        ellipse_B.center
      );
      // remove curve from inside ellipse_A
      curve = curve.splitAtParameter(curve.intersectEllipse(ellipse_A)[0].t)[1];
      curve = curve.splitAtParameter(curve.intersectEllipse(ellipse_B)[0].t)[0];
      clean_curves.push(curve);
      // var clean_curve =
      // const intersections_A = curve.intersectEllipse(circle_A)[0];
      // var clean_curve = curve.splitAtParameter(intersections_A.t)[1];
      // const intersections_B = clean_curve.intersectEllipse(circle_B)[0];
      // clean_curve = clean_curve.splitAtParameter(intersections_B.t)[0];
      // AB_clean_curves.push(clean_curve);
    }
    result.push({
      mid_Point: mid_point,
      tangent: new Line(tangent_startpoint, tangent_endpoint),
      anchors: anchors,
      curves: clean_curves,
    });
  }
  return result;
}

const edge_curves = createEdgeCurves(node_edges);

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

if (!DEBUG) {
  console.log(`<svg id="Layer_2" data-name="Layer 2"`);
  console.log(
    `xmlns="http://www.w3.org/2000/svg" width="${width}mm" height="${height}mm" viewBox="0 0 ${width} ${height}">`
  );
  ellipses.forEach((ellipse) => {
    console.log(
      `<ellipse cx="${ellipse.center.x}" cy="${ellipse.center.y}" rx="${
        ellipse.rx / 2
      }" ry="${
        ellipse.ry / 2
      }" style="fill: none; stroke: black; stroke-linejoin: round; stroke-width: 4px;"/>`
    );
  });

  node_edges.forEach((node) => {
    console.log(
      `<line x1="${node.line.start.x}" y1="${node.line.start.y}" x2="${node.line.end.x}" y2="${node.line.end.y}" style="fill: none; stroke: black; stroke-linejoin: round; stroke-width: 1px;" />`
    );
  });

  edge_curves.forEach((edge_curve) => {
    console.log(
      `<line x1="${edge_curve.tangent.start.x}" y1="${edge_curve.tangent.start.y}" x2="${edge_curve.tangent.end.x}" y2="${edge_curve.tangent.end.y}" style="fill: none; stroke: red; stroke-linejoin: round; stroke-width: 1px;" />`
    );
    edge_curve.anchors.forEach((anchor) => {
      console.log(
        `<circle cx="${anchor.x}" cy="${anchor.y}" r="2" style="fill: red;"/>`
      );
    });
    edge_curve.curves.forEach((curve) => {
      console.log(
        `<path d="${curve.toString()}" style="fill: none; stroke: black; stroke-linejoin: round; stroke-width: 1px;"/>`
      );
    });
  });

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
  console.log(`</svg>`);
}
