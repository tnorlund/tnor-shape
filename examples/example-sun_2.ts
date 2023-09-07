import * as fs from "fs";

import { Canvas } from "../src/Canvas";
import { Point2D } from "../src/Point2D";
import { Ellipse, Line, Rectangle } from "../src/Shape";
import { Vector2D } from "../src/Vector2D";

const DEBUG = true;
// canvas dimensions are given in mm
const CANVAS_HEIGHT = 275;
const CANVAS_WIDTH = 430;
const CANVAS_PADDING = 20;
const NUMBER_SUNS = 15;
const MIN_SUN_RADIUS = 5;
const MAX_SUN_RADIUS = 40;
const MIN_RECTANGLE_WIDTH = 30;
const MAX_RECTANGLE_WIDTH = 120;
const MIN_RECTANGLE_HEIGHT = 30;
const MAX_RECTANGLE_HEIGHT = 120;
const MAX_RECTANGLE_OFFSET = 50;
const MIN_NUMBER_LINES = 10;
const MAX_NUMBER_LINES = 75;
const COLORS = [
    `#252937`, // Black
  //   `#002BDB`, // Blue
  //   `#009AC1`, // Turquoise
  // `#2B6855`, // Green
  //   `#82BC0E`, // Lime
  //   `#53B79C`, // Aqua
    `#E0D200`, // Yellow
  // `#DB482D`, // Orange
  //   `#C1003C`, // Red
    `#95067A`, // Berry
  //   `#6A4ACB`, // Purple
  // `#411A09`, // Brown
];

function randomIntFromInterval(min: number, max: number): number {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
interface Sun {
  circle: Ellipse;
  rectangle: Rectangle;
  lines: Line[];
  color: string;
}
interface Suns {
  canvas: Canvas;
  shapes: Sun[];
}
function generateSuns(number_suns: number = NUMBER_SUNS): Suns {
  const shapes = [];
  const canvas = new Canvas(CANVAS_HEIGHT, CANVAS_WIDTH);
  for (let sun_index = 0; sun_index < number_suns; sun_index++) {
    const random_radius_2 = randomIntFromInterval(
      MIN_SUN_RADIUS,
      MAX_SUN_RADIUS
    );
    const circle = new Ellipse(
      new Point2D(
        randomIntFromInterval(
          0 + CANVAS_PADDING,
          CANVAS_WIDTH - CANVAS_PADDING
        ),
        randomIntFromInterval(
          0 + CANVAS_PADDING,
          CANVAS_HEIGHT - CANVAS_PADDING
        )
      ),
      random_radius_2,
      random_radius_2
    );
    // create a rectangle that contains the circle and is on the canvas
    var rectangle = new Rectangle(
      randomIntFromInterval(
        circle.center.x - MAX_RECTANGLE_OFFSET,
        circle.center.x - random_radius_2 / 2
      ),
      randomIntFromInterval(
        circle.center.y - MAX_RECTANGLE_OFFSET,
        circle.center.y - random_radius_2 / 2
      ),
      randomIntFromInterval(MIN_RECTANGLE_WIDTH, MAX_RECTANGLE_WIDTH),
      randomIntFromInterval(MIN_RECTANGLE_HEIGHT, MAX_RECTANGLE_HEIGHT)
    );
    while (true) {
      rectangle = new Rectangle(
        randomIntFromInterval(
          circle.center.x - MAX_RECTANGLE_OFFSET,
          circle.center.x - random_radius_2 / 2
        ),
        randomIntFromInterval(
          circle.center.y - MAX_RECTANGLE_OFFSET,
          circle.center.y - random_radius_2 / 2
        ),
        randomIntFromInterval(MIN_RECTANGLE_WIDTH, MAX_RECTANGLE_WIDTH),
        randomIntFromInterval(MIN_RECTANGLE_HEIGHT, MAX_RECTANGLE_HEIGHT)
      );
      if (canvas.onCanvas(rectangle)) {
        break;
      }
    }

    const number_lines = randomIntFromInterval(
      MIN_NUMBER_LINES,
      MAX_NUMBER_LINES
    );
    const lines = [];
    for (let line_index = 0; line_index < number_lines; line_index++) {
      // angle in radians
      const angle = 2 * Math.PI * (line_index / number_lines);
      const circle_intersection = new Point2D(
        circle.center.x + (Math.cos(angle) * circle.rx) / 2,
        circle.center.y + (Math.sin(angle) * circle.rx) / 2
      );
      const intersections = new Line(
        circle.center,
        new Point2D(
          circle.center.x + Math.cos(angle) * 100,
          circle.center.y + Math.sin(angle) * 100
        )
      ).intersectRectangle(rectangle);
      // Math.atan2(p2.y - p1.y, p2.x - p1.x)
      if (intersections.length == 1) {
        if (
          new Line(circle_intersection, intersections[0].point).getBoundingBox().overlaps(rectangle.getBoundingBox())
          // rectangle.getBoundingBox().overlaps(new Line(circle_intersection, intersections[0].point).getBoundingBox())
        ) {
          lines.push(new Line(circle_intersection, intersections[0].point))
        }

        // if (
        //   Math.round((angle - Math.PI + Number.EPSILON) * 100) / 100 ==
        //   Math.round(
        //     (Math.atan2(
        //       circle_intersection.y - intersections[0].point.y,
        //       circle_intersection.x - intersections[0].point.x
        //     ) +
        //       Number.EPSILON) *
        //       100
        //   ) /
        //     100
        // ) {
        //   lines.push(new Line(circle_intersection, intersections[0].point));
        // } else {
        //   if (
        //     Math.round((angle + Math.PI + Number.EPSILON) * 100) / 100 ==
        //     Math.round(
        //       (Math.atan2(
        //         circle_intersection.y - intersections[0].point.y,
        //         circle_intersection.x - intersections[0].point.x
        //       ) +
        //         Number.EPSILON) *
        //         100
        //     ) /
        //       100
        //   ) {
        //     lines.push(new Line(circle_intersection, intersections[0].point));
        //   }
        // }




        // const intersection_distance_from_center = new Vector2D().fromPoints(circle.center, intersections[0].point).length()
        // console.log(intersection_distance_from_center)

        // const line = new Line(circle_intersection, intersections[0].point);

        // Only add lines that are found within the rectangle
        //   this means that the starting point is only found on the circle and not the rectangle
        // if (
        // !(
        //   Math.round((line.start.y + Number.EPSILON) * 100) / 100 == Math.round((rectangle.y + Number.EPSILON) * 100) / 100 ||
        //   Math.round((line.start.y + Number.EPSILON) * 100) / 100 == Math.round((rectangle.y + rectangle.height + Number.EPSILON) * 100) / 100 ||
        //   Math.round((line.start.x + Number.EPSILON) * 100) / 100 == Math.round((rectangle.x + Number.EPSILON) * 100) / 100 ||
        //   Math.round((line.start.x + Number.EPSILON) * 100) / 100 == Math.round((rectangle.x + rectangle.width + Number.EPSILON) * 100) / 100
        // )

        //   rectangle.getBoundingBox().overlaps(line.getBoundingBox())
        // ) {
        //   lines.push(line);
        // }
      }
    }
    shapes.push({
      circle: circle,
      rectangle: rectangle,
      lines: lines,
      color: COLORS[sun_index % COLORS.length],
    });
  }
  return { canvas: canvas, shapes: shapes };
}

const suns = generateSuns();
var svg_output = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>${suns.canvas.toSVGTag()}`;

COLORS.forEach((color, color_index) => {
  svg_output += `<g inkscape:groupmode="layer" id="layer${
    color_index + 1
  }" inkscape:label="${
    color_index + 1
  }-layer" stroke="${color}" stroke-width="0.5px" fill="none">`;
  suns.shapes
    .filter((shape) => shape.color == color)
    .forEach((sun) => {
      // svg_output += `<rect x="${sun.rectangle.x}" y="${sun.rectangle.y}" width="${sun.rectangle.width}" height="${sun.rectangle.height}" style="fill: none; stroke: black; stroke-linejoin: round; stroke-width: 1px;"/>`
      sun.lines.forEach((line) => {
        svg_output += `<line x1="${line.start.x}" y1="${line.start.y}" x2="${line.end.x}" y2="${line.end.y}" stroke="${color}"/>`;
      });
    });
  svg_output += `</g>`;
});

fs.writeFileSync(
  `examples/output/sun_${new Date().toISOString()}.svg`,
  svg_output + `</svg>`,
  `utf-8`
);
