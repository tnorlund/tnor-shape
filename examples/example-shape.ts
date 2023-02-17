import * as fs from "fs";

import { Matrix2D } from "../src/Matrix2D";
import { Point2D } from "../src/Point2D";
import {
  CubicBezier,
  pathToQuadraticBezier,
  pathToCubicBezier,
  Ellipse,
  Line,
  QuadraticBezier,
  BoundingBox,
} from "../src/Shape";
import { Vector2D } from "../src/Vector2D";

function randomIntFromInterval(min: number, max: number): number {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const DEBUG = false;

const width = 430;
const height = 275;
const number_circles = 10;

const padding = 30;

function onPaper(shape: QuadraticBezier | Ellipse): boolean {
  return (
    new Line(new Point2D(0, padding), new Point2D(width, padding))
      .getBoundingBox()
      .overlaps(shape.getBoundingBox()) ||
    new Line(
      new Point2D(width - padding, 0),
      new Point2D(width - padding, height)
    )
      .getBoundingBox()
      .overlaps(shape.getBoundingBox()) ||
    new Line(
      new Point2D(0, height - padding),
      new Point2D(width, height - padding)
    )
      .getBoundingBox()
      .overlaps(shape.getBoundingBox()) ||
    new Line(new Point2D(0, padding), new Point2D(0, height - padding))
      .getBoundingBox()
      .overlaps(shape.getBoundingBox())
  );
}

function randomizeEllipses(number_circles: number): Ellipse[] {
  const result: Ellipse[] = [];
  for (let index = 0; index < number_circles; index++) {
    const this_ellipse = new Ellipse(
      new Point2D(
        randomIntFromInterval(0 + padding, width - padding),
        randomIntFromInterval(0 + padding, height - padding)
      ),
      randomIntFromInterval(padding, padding + 20),
      randomIntFromInterval(padding, padding + 20)
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
    if (!overlapping && onPaper(this_ellipse)) {
      result.push(this_ellipse);
    }
  }
  return result;
}

const ellipses = randomizeEllipses(number_circles);

function targetInEllipse(ellipses: Ellipse[]): Ellipse[] {
  const result: Ellipse[] = [];
  const number_ellipses = randomIntFromInterval(3, 10);

  return result;
}

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
    const lerp_length = randomIntFromInterval(3, 9) / 9;
    const angle_adjustment =
      (randomIntFromInterval(50, 100) / 100) * (Math.PI / 2);
    const tangent_endpoint = mid_point
      .lerp(line.end, lerp_length)
      .transform(matrix.rotationAt(angle_adjustment, mid_point));
    const tangent_startpoint = mid_point
      .lerp(line.end, lerp_length)
      .transform(matrix.rotationAt(-angle_adjustment, mid_point));
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
      // remove curve from inside ellipse_B
      curve = curve.splitAtParameter(curve.intersectEllipse(ellipse_B)[0].t)[0];
      var overlapping = false;
      for (
        let outer_index = index;
        outer_index < node_edges.length;
        outer_index++
      ) {
        const outer_ellipse_A = node_edges[outer_index].ellipse_A;
        const outer_ellipse_B = node_edges[outer_index].ellipse_B;
        // skip this iteration if A or B is found to be the same as this A or B
        if (
          ellipse_A.center.equals(outer_ellipse_A.center) ||
          ellipse_A.center.equals(outer_ellipse_B.center) ||
          ellipse_B.center.equals(outer_ellipse_A.center) ||
          ellipse_B.center.equals(outer_ellipse_B.center)
        ) {
          continue;
        }
        if (!onPaper(curve)) {
          continue;
        }
        if (
          curve.getBoundingBox().overlaps(outer_ellipse_A.getBoundingBox()) ||
          curve.getBoundingBox().overlaps(outer_ellipse_B.getBoundingBox())
        ) {
          overlapping = true;
        }
      }
      if (!overlapping) {
        clean_curves.push(curve);
      }
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
const file_name = `examples/output/${new Date().toISOString()}.svg`;
let svg_output = ``;
ellipses.forEach((ellipse) => {
  svg_output += `<ellipse cx="${ellipse.center.x}" cy="${
    ellipse.center.y
  }" rx="${ellipse.rx / 2}" ry="${
    ellipse.ry / 2
  }" style="fill: none; stroke: black; stroke-linejoin: round; stroke-width: 4px;"/>`;
});
edge_curves.forEach((edge_curve) => {
  edge_curve.curves.forEach((curve) => {
    svg_output += `<path d="${curve.toString()}" style="fill: none; stroke: black; stroke-linejoin: round; stroke-width: 1px;"/>`
  });
});
if (!DEBUG) {
  fs.writeFileSync(
    file_name,
    `<?xml version="1.0" encoding="UTF-8" standalone="no"?>` +
      `<svg id="Layer_2" data-name="Layer 2" width="${width}mm" height="${height}mm" viewBox="0 0 ${width} ${height}" version="1.1" sodipodi:docname="example.svg" inkscape:version="1.2.2 (b0a84865, 2022-12-01)" ` +
      `xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" ` +
      `xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" ` +
      `xmlns="http://www.w3.org/2000/svg" ` +
      `xmlns:svg="http://www.w3.org/2000/svg">` +
      svg_output + 
      `</svg>`,
    "utf-8"
  );
}
