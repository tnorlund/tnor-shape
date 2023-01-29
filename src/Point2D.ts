class Point2D {
  x: number;
  y: number;
  public constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  /**
   * Translate this point by that point
   *
   * @param {Point2D} that
   */
  public add(that: Point2D): Point2D {
    return this.constructor(this.x + that.x, this.y + that.y);
  }

  public subtract(that: Point2D) {
    return this.constructor(this.x - that.x, this.y - that.y);
  }

  /**
   *
   * @param {number} scalar
   */
  public multiply(scalar: number): Point2D {
    return this.constructor(this.x * scalar, this.y * scalar);
  }

  /**
   * 
   * @returns {string} The string representation of the point
   */
  public toString():string {
    return `point(${this.x},${this.y})`;
  }
}

export default Point2D;
