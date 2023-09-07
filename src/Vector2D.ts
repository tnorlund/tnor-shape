import { Point2D } from "./Point2D";

export class Vector2D {
  x: number;
  y: number;
  public constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  add(that: Vector2D): Vector2D {
    return new Vector2D(this.x + that.x, this.y + that.y);
  }

  subtract(that: Vector2D): Vector2D {
    return new Vector2D(this.x - that.x, this.y - that.y);
  }

  multiply(scalar: number): Vector2D {
    return new Vector2D(this.x * scalar, this.y * scalar);
  }

  divide(scalar: number): Vector2D {
    return new Vector2D(this.x / scalar, this.y / scalar);
  }

  fromPoints(p1: Point2D, p2: Point2D): Vector2D {
    return new Vector2D(p2.x - p1.x, p2.y - p1.y);
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  dot(that: Vector2D): number {
    return this.x * that.x + this.y * that.y;
  }

  perp(): Vector2D {
    return new Vector2D(-this.y, this.x);
  }

  perpendicular(that: Vector2D) {
    return this.subtract(this.project(that));
  }

  project(that: Vector2D) {
    const percent = this.dot(that) / that.dot(that);

    return that.multiply(percent);
  }
}
