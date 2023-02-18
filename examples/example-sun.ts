import * as fs from "fs";

import { Canvas } from "../src/Canvas";
import { Point2D } from "../src/Point2D";
import { Ellipse, Line, Rectangle } from "../src/Shape";

const DEBUG = false;
const canvas = new Canvas(275, 430);

// const x = Math.PI * 6;
// console.log(Math.sin (2 * x) + Math.sin(Math.PI * x))

function randomIntFromInterval(min: number, max: number): number {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
interface Sun {
  circle: Ellipse;
  rectangle: Rectangle;
}
function randomizeSuns(number_circles: number): Sun[] {
  const result: Sun[] = [];
  for (let index = 0; index < number_circles; index++) {
    const random_radius = randomIntFromInterval(5, 15);
    const this_ellipse = new Ellipse(
      new Point2D(
        randomIntFromInterval(0, canvas.width),
        randomIntFromInterval(0, canvas.height)
      ),
      random_radius,
      random_radius
    );
    var overlapping = false;
    for (let index = 0; index < result.length; index++) {
      const other_ellipse = result[index].circle;
      if (
        this_ellipse.getBoundingBox().overlaps(other_ellipse.getBoundingBox())
      ) {
        overlapping = true;
      }
    }
    const rectangle_x = randomIntFromInterval(
      this_ellipse.center.x - 40,
      this_ellipse.center.x - (10 + random_radius)
    );
    const rectangle_y = randomIntFromInterval(
      this_ellipse.center.y - 40,
      this_ellipse.center.y - (10 + random_radius)
    );
    const rectangle_width = randomIntFromInterval(40, 100);
    const rectangle_height = randomIntFromInterval(40, 100);
    const rectangle = new Rectangle(
      rectangle_x,
      rectangle_y,
      rectangle_width,
      rectangle_height
    );
    // TODO: ensure the circle is within the rectangle
    if (
      //     shape_bbox.x > 0 &&
      //   shape_bbox.y > 0 && // top left
      canvas.onCanvas(rectangle) &&
      !overlapping &&
      canvas.onCanvas(this_ellipse)
    ) {
      result.push({ circle: this_ellipse, rectangle: rectangle });
    }
  }
  return result;
}
interface RadiatingSun {
  circle: Ellipse;
  rectangle: Rectangle;
  lines: Line[];
}
function radiateSuns(suns: Sun[]): RadiatingSun[] {
  const result: RadiatingSun[] = [];
  suns.forEach((sun) => {
    const circle = sun.circle;
    const rectangle = sun.rectangle;
    const lines = [];
    const number_lines = 10;
    // console.log(circle.center)
    for (let index = 0; index < number_lines; index++) {
      const angle = 2 * Math.PI * (index / number_lines);
      const x = circle.center.x + Math.cos(angle) * canvas.width;
      const y = circle.center.y + Math.sin(angle) * canvas.width;
      const end = new Point2D(x, y);
      const line = new Line(circle.center, end);
      const intersections = line.intersectRectangle(rectangle);
      if (intersections.length == 1) {
        line.end = intersections[0].point;
      } 
    //   else {
    //     console.log(intersections);
    //   }
      lines.push(line);
    }
    result.push({ circle: circle, rectangle: rectangle, lines: lines });
  });
  return result;
}

const suns = randomizeSuns(5);
const radiating_suns = radiateSuns(suns);
var svg_output = ``;
const file_name = `examples/output/sun_${new Date().toISOString()}.svg`;
suns.forEach((sun) => {
  svg_output +=
    `<circle cx="${sun.circle.center.x}" cy="${sun.circle.center.y}" r="${
      sun.circle.rx / 2
    }" style="fill: none; stroke: black; stroke-linejoin: round; stroke-width: 2px;"/>` +
    `<rect x="${sun.rectangle.x}" y="${sun.rectangle.y}" width="${sun.rectangle.width}" height="${sun.rectangle.height}" style="fill: none; stroke: black; stroke-linejoin: round; stroke-width: 1px;"/>`;
});
radiating_suns.forEach((sun) => {
  sun.lines.forEach((line) => {
    svg_output += `<line x1="${line.start.x}" y1="${line.start.y}" x2="${line.end.x}" y2="${line.end.y}" style="fill: none; stroke: black; stroke-linejoin: round; stroke-width: 1mm;" />`;
  });
});
if (!DEBUG) {
  fs.writeFileSync(
    file_name,
    `<?xml version="1.0" encoding="UTF-8" standalone="no"?>` +
      canvas.toSVGTag() +
      svg_output +
      `</svg>`,
    "utf-8"
  );
}
