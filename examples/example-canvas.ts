import { Canvas } from "../src/Canvas";
import { Point2D } from "../src/Point2D";
import { Line } from "../src/Shape";

const canvas = new Canvas(10, 10);
const shape = new Line(new Point2D(1, 1), new Point2D(1, 2));
const shape_bbox = shape.getBoundingBox();

console.log(shape_bbox.x > 0 && shape_bbox.y > 0);
console.log(shape_bbox.width < canvas.width && shape_bbox.y > 0);
console.log(shape_bbox.width < canvas.width && shape_bbox.height > canvas.height);
console.log(shape_bbox.x > 0 && shape_bbox.height > canvas.height);
