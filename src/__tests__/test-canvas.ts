import { describe, expect, test } from "@jest/globals";
import { Point2D } from "../Point2D";
import {
  BeziersToPath,
  BoundingBox,
  CubicBezier,
  Ellipse,
  Line,
  QuadraticBezier,
} from "../Shape";
import { Canvas } from "../Canvas";

describe("testing canvas", () => {
  test("Canvas are in width and height order", () => {
    const canvas = new Canvas(10, 20);
    expect(canvas.width).toBe(20);
    expect(canvas.height).toBe(10);
  });
  test("A line can be found on the canvas", () => {
    const canvas = new Canvas(10, 10);
    const L = new Line(new Point2D(1, 1), new Point2D(1, 2));
    expect(canvas.onCanvas(L)).toBe(true);
  });
  test("A line can be found off the top left of the canvas", () => {
    const canvas = new Canvas(10, 10);
    const L = new Line(new Point2D(1, 1), new Point2D(0, -1));
    expect(canvas.onCanvas(L)).toBe(false);
  });
  test("A line can be found off the top right of the canvas", () => {
    const canvas = new Canvas(10, 10);
    const L = new Line(new Point2D(1, 1), new Point2D(11, -1));
    expect(canvas.onCanvas(L)).toBe(false);
  });
  test("A line can be found off the bottom right of the canvas", () => {
    const canvas = new Canvas(10, 10);
    const L = new Line(new Point2D(1, 1), new Point2D(11, 11));
    expect(canvas.onCanvas(L)).toBe(false);
  });
  test("A line can be found off the bottom left of the canvas", () => {
    const canvas = new Canvas(10, 10);
    const L = new Line(new Point2D(1, 1), new Point2D(11, 11));
    expect(canvas.onCanvas(L)).toBe(false);
  });
});
