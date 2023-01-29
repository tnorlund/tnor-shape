export class Point2D {
  x: number;
  y: number;
  public constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  /**
   * Adds a 2-dimensional point to this 2-dimensional point
   *
   * @param {Point2D} that
   * @returns The result of adding this 2-dimensional point with that
   */
  public add(that: Point2D): Point2D {
    return new Point2D(this.x + that.x, this.y + that.y);
  }

  /**
   * Subtracts a 2-dimensional point to this 2-dimensional point
   *
   * @param {Point2D} that
   * @returns The result of subtracting this 2-dimensional point from that
   */
  public subtract(that: Point2D) {
    return new Point2D(this.x - that.x, this.y - that.y);
  }

  /**
   * Multiplies this 2-dimensional point by a scalar
   * 
   * @param {number} scalar
   */
  public multiply(scalar: number): Point2D {
    return new Point2D(this.x * scalar, this.y * scalar);
  }

  /**
   *
   * @returns {string} The string representation of the point
   */
  public toString(): string {
    return `point(${this.x},${this.y})`;
  }
}
