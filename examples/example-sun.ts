import * as fs from "fs";

import { Canvas } from "../src/Canvas";
import { Point2D } from "../src/Point2D";
import { Ellipse, Line, Rectangle } from "../src/Shape";

const DEBUG = true;
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
    const random_radius = randomIntFromInterval(5, 20);
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
    const number_lines = randomIntFromInterval(10, 75);
    // console.log(circle.center)
    for (let index = 0; index < number_lines; index++) {
      const angle = 2 * Math.PI * (index / number_lines);
      const x = circle.center.x + Math.cos(angle) * canvas.width;
      const y = circle.center.y + Math.sin(angle) * canvas.width;
      const end = new Point2D(x, y);
      const line = new Line(circle.center, end);
      const line_intersections = line.intersectRectangle(rectangle);
      if (line_intersections.length == 1) {
        line.end = line_intersections[0].point;
      }
      lines.push(line);
      const circle_intersections = circle.intersectLine(line);
      if (circle_intersections.length == 1) {
        line.start = circle_intersections[0].point;
      }
    }
    result.push({ circle: circle, rectangle: rectangle, lines: lines });
  });
  return result;
}

// const suns = randomizeSuns(5);
const radiating_suns = radiateSuns(randomizeSuns(200));
var svg_output = ``;
const file_name = `examples/output/sun_${new Date().toISOString()}.svg`;
const colors = [
  `#252937`,
  `#002BDB`,
  `#009AC1`,
  `#2B6855`,
  `#82BC0E`,
  `#53B79C`,
  `#E0D200`,
  `#DB482D`,
  `#C1003C`,
  `#95067A`,
  `#6A4ACB`,
  `#411A09`,
];
// Black:  `#252937`
// Blue: `#002BDB`
// Turquoise: `#009AC1`
// Green: `#2B6855`
// Lime: `#82BC0E`
// Aqua: `#53B79C`
// Yellow: `#E0D200`
// Orange: `#DB482D`
// Red: `#С1003C`
// Berry: `#95067A`
// Purple:`#бА4АСВ`
// Brown: `#411A09`
const num_layers = 12;
let remainder = radiating_suns.length % num_layers;
console.log(radiating_suns.length, remainder);
// console.log();
// TODO fix iteration
for (let index = 0; index < num_layers; index++) {
  // const element = array[index];
  svg_output += `<g inkscape:groupmode="layer" id="layer${
    index + 1
  }" inkscape:label="${index + 1}-thick"
  stroke="${colors[index]}" stroke-width="0.5mm" fill="none"
  >`;
  const index_start = Math.floor(index * (radiating_suns.length / num_layers));
  let index_end = 0;
  if (remainder > 0) {
    index_end =
      Math.floor((index + 1) * (radiating_suns.length / num_layers));
  } else {
    index_end = Math.floor((index + 1) * (radiating_suns.length / num_layers));
  }
  console.log(index_start, index_end);
  remainder -= 1;
  //   if (index_end == radiating_suns.length) {
  //     index_end -= 1;
  //   }
  svg_output += `<g>`;
  for (let sun_index = index_start; sun_index < index_end; sun_index++) {
    console.log(sun_index);
    const sun = radiating_suns[sun_index];
    sun.lines.forEach((line) => {
      svg_output += `<line x1="${line.start.x}" y1="${line.start.y}" x2="${line.end.x}" y2="${line.end.y}"/>`;
    });
  }
  svg_output += `</g>`;
  svg_output += `</g>`;
}
// console.log()
// suns.forEach((sun) => {
//   svg_output +=
//     `<circle cx="${sun.circle.center.x}" cy="${sun.circle.center.y}" r="${
//       sun.circle.rx / 2
//     }" style="fill: none; stroke: black; stroke-linejoin: round; stroke-width: 2px;"/>` +
//     `<rect x="${sun.rectangle.x}" y="${sun.rectangle.y}" width="${sun.rectangle.width}" height="${sun.rectangle.height}" style="fill: none; stroke: black; stroke-linejoin: round; stroke-width: 1px;"/>`;
// });
// radiating_suns.forEach((sun) => {
//   sun.lines.forEach((line) => {
//     svg_output += `<line x1="${line.start.x}" y1="${line.start.y}" x2="${line.end.x}" y2="${line.end.y}" style="fill: none; stroke: black; stroke-linejoin: round; stroke-width: 0.5mm;" />`;
//   });
// });
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
