import { Point2D } from "./Point2D";
import { Polynomial } from "./Polynomial";

interface Intersection {
  point: Point2D;
  t: number | null;
}

export class BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  overlaps(that: BoundingBox): boolean {
    return (
      this.x < that.x + that.width &&
      this.x + this.width > that.x &&
      this.y < that.y + that.height &&
      this.y + this.height > that.y
    );
  }

  isEmpty(): boolean {
    return this.width !== 0 && this.height !== 0;
  }
}

function bezout(e1: number[], e2: number[]): Polynomial {
  const AB = e1[0] * e2[1] - e2[0] * e1[1];
  const AC = e1[0] * e2[2] - e2[0] * e1[2];
  const AD = e1[0] * e2[3] - e2[0] * e1[3];
  const AE = e1[0] * e2[4] - e2[0] * e1[4];
  const AF = e1[0] * e2[5] - e2[0] * e1[5];
  const BC = e1[1] * e2[2] - e2[1] * e1[2];
  const BE = e1[1] * e2[4] - e2[1] * e1[4];
  const BF = e1[1] * e2[5] - e2[1] * e1[5];
  const CD = e1[2] * e2[3] - e2[2] * e1[3];
  const DE = e1[3] * e2[4] - e2[3] * e1[4];
  const DF = e1[3] * e2[5] - e2[3] * e1[5];
  const BFpDE = BF + DE;
  const BEmCD = BE - CD;

  return new Polynomial(
    AB * BC - AC * AC,
    AB * BEmCD + AD * BC - 2 * AC * AE,
    AB * BFpDE + AD * BEmCD - AE * AE - 2 * AC * AF,
    AB * DF + AD * BFpDE - 2 * AE * AF,
    AD * DF - AF * AF
  );
}

export function pathToCubicBezier(path: string): CubicBezier | void {
  const result =
    /^m(\d+\.\d+|\d+|-\d+\.\d+|-\d+),(\d+\.\d+|\d+|-\d+\.\d+|-\d+)c(\d+\.\d+|\d+|-\d+\.\d+|-\d+)(\d+\.\d+|\d+|-\d+\.\d+|-\d+),(\d+\.\d+|\d+|-\d+\.\d+|-\d+)(\d+\.\d+|\d+|-\d+\.\d+|-\d+),(\d+\.\d+|\d+|-\d+\.\d+|-\d+)(\d+\.\d+|\d+|-\d+\.\d+|-\d+)/.exec(
      path
    );
  if (result !== null) {
    const b0 = new Point2D(Number(result[1]), Number(result[2]));
    const b1 = new Point2D(b0.x + Number(result[3]), b0.y + Number(result[4]));
    const b2 = new Point2D(b0.x + Number(result[5]), b0.y + Number(result[6]));
    const b3 = new Point2D(b0.x + Number(result[7]), b0.y + Number(result[8]));
    return new CubicBezier(b0, b1, b2, b3);
  }
}

export class CubicBezier {
  b0: Point2D;
  b1: Point2D;
  b2: Point2D;
  b3: Point2D;
  public constructor(b0: Point2D, b1: Point2D, b2: Point2D, b3: Point2D) {
    this.b0 = b0;
    this.b1 = b1;
    this.b2 = b2;
    this.b3 = b3;
  }

  public intersectCubicBezier(that: CubicBezier): Intersection[] {
    if (!this.getBoundingBox().overlaps(that.getBoundingBox())) return [];
    let a, b, c, d;
    const result: Intersection[] = [];

    a = this.b0.multiply(-1);
    b = this.b1.multiply(3);
    c = this.b2.multiply(-3);
    d = a.add(b.add(c.add(this.b3)));
    const c13 = new Point2D(d.x, d.y);

    a = this.b0.multiply(3);
    b = this.b1.multiply(-6);
    c = this.b2.multiply(3);
    d = a.add(b.add(c));
    const c12 = new Point2D(d.x, d.y);

    a = this.b0.multiply(-3);
    b = this.b1.multiply(3);
    c = a.add(b);
    const c11 = new Point2D(c.x, c.y);

    const c10 = new Point2D(this.b0.x, this.b0.y);

    a = that.b0.multiply(-1);
    b = that.b1.multiply(3);
    c = that.b2.multiply(-3);
    d = a.add(b.add(c.add(that.b3)));
    const c23 = new Point2D(d.x, d.y);

    a = that.b0.multiply(3);
    b = that.b1.multiply(-6);
    c = that.b2.multiply(3);
    d = a.add(b.add(c));
    const c22 = new Point2D(d.x, d.y);

    a = that.b0.multiply(-3);
    b = that.b1.multiply(3);
    c = a.add(b);
    const c21 = new Point2D(c.x, c.y);

    const c20 = new Point2D(that.b0.x, that.b0.y);

    a = c13.x * c12.y - c12.x * c13.y;
    b = c13.x * c11.y - c11.x * c13.y;
    const c0 = c13.x * c10.y - c10.x * c13.y + c20.x * c13.y - c13.x * c20.y;
    const c1 = c21.x * c13.y - c13.x * c21.y;
    const c2 = c22.x * c13.y - c13.x * c22.y;
    const c3 = c23.x * c13.y - c13.x * c23.y;
    d = c13.x * c11.y - c11.x * c13.y;
    const e0 =
      c13.x * c10.y +
      c12.x * c11.y -
      c11.x * c12.y -
      c10.x * c13.y +
      c20.x * c13.y -
      c13.x * c20.y;
    const e1 = c21.x * c13.y - c13.x * c21.y;
    const e2 = c22.x * c13.y - c13.x * c22.y;
    const e3 = c23.x * c13.y - c13.x * c23.y;
    const f0 = c12.x * c10.y - c10.x * c12.y + c20.x * c12.y - c12.x * c20.y;
    const f1 = c21.x * c12.y - c12.x * c21.y;
    const f2 = c22.x * c12.y - c12.x * c22.y;
    const f3 = c23.x * c12.y - c12.x * c23.y;
    const g0 = c13.x * c10.y - c10.x * c13.y + c20.x * c13.y - c13.x * c20.y;
    const g1 = c21.x * c13.y - c13.x * c21.y;
    const g2 = c22.x * c13.y - c13.x * c22.y;
    const g3 = c23.x * c13.y - c13.x * c23.y;
    const h0 = c12.x * c10.y - c10.x * c12.y + c20.x * c12.y - c12.x * c20.y;
    const h1 = c21.x * c12.y - c12.x * c21.y;
    const h2 = c22.x * c12.y - c12.x * c22.y;
    const h3 = c23.x * c12.y - c12.x * c23.y;
    const i0 = c11.x * c10.y - c10.x * c11.y + c20.x * c11.y - c11.x * c20.y;
    const i1 = c21.x * c11.y - c11.x * c21.y;
    const i2 = c22.x * c11.y - c11.x * c22.y;
    const i3 = c23.x * c11.y - c11.x * c23.y;

    const poly = new Polynomial(
      -c3 * e3 * g3,
      -c3 * e3 * g2 - c3 * e2 * g3 - c2 * e3 * g3,
      -c3 * e3 * g1 -
        c3 * e2 * g2 -
        c2 * e3 * g2 -
        c3 * e1 * g3 -
        c2 * e2 * g3 -
        c1 * e3 * g3,
      -c3 * e3 * g0 -
        c3 * e2 * g1 -
        c2 * e3 * g1 -
        c3 * e1 * g2 -
        c2 * e2 * g2 -
        c1 * e3 * g2 -
        c3 * e0 * g3 -
        c2 * e1 * g3 -
        c1 * e2 * g3 -
        c0 * e3 * g3 +
        b * f3 * g3 +
        c3 * d * h3 -
        a * f3 * h3 +
        a * e3 * i3,
      -c3 * e2 * g0 -
        c2 * e3 * g0 -
        c3 * e1 * g1 -
        c2 * e2 * g1 -
        c1 * e3 * g1 -
        c3 * e0 * g2 -
        c2 * e1 * g2 -
        c1 * e2 * g2 -
        c0 * e3 * g2 +
        b * f3 * g2 -
        c2 * e0 * g3 -
        c1 * e1 * g3 -
        c0 * e2 * g3 +
        b * f2 * g3 +
        c3 * d * h2 -
        a * f3 * h2 +
        c2 * d * h3 -
        a * f2 * h3 +
        a * e3 * i2 +
        a * e2 * i3,
      -c3 * e1 * g0 -
        c2 * e2 * g0 -
        c1 * e3 * g0 -
        c3 * e0 * g1 -
        c2 * e1 * g1 -
        c1 * e2 * g1 -
        c0 * e3 * g1 +
        b * f3 * g1 -
        c2 * e0 * g2 -
        c1 * e1 * g2 -
        c0 * e2 * g2 +
        b * f2 * g2 -
        c1 * e0 * g3 -
        c0 * e1 * g3 +
        b * f1 * g3 +
        c3 * d * h1 -
        a * f3 * h1 +
        c2 * d * h2 -
        a * f2 * h2 +
        c1 * d * h3 -
        a * f1 * h3 +
        a * e3 * i1 +
        a * e2 * i2 +
        a * e1 * i3,
      -c3 * e0 * g0 -
        c2 * e1 * g0 -
        c1 * e2 * g0 -
        c0 * e3 * g0 +
        b * f3 * g0 -
        c2 * e0 * g1 -
        c1 * e1 * g1 -
        c0 * e2 * g1 +
        b * f2 * g1 -
        c1 * e0 * g2 -
        c0 * e1 * g2 +
        b * f1 * g2 -
        c0 * e0 * g3 +
        b * f0 * g3 +
        c3 * d * h0 -
        a * f3 * h0 +
        c2 * d * h1 -
        a * f2 * h1 +
        c1 * d * h2 -
        a * f1 * h2 +
        c0 * d * h3 -
        a * f0 * h3 +
        a * e3 * i0 +
        a * e2 * i1 +
        a * e1 * i2 -
        b * d * i3 +
        a * e0 * i3,
      -c2 * e0 * g0 -
        c1 * e1 * g0 -
        c0 * e2 * g0 +
        b * f2 * g0 -
        c1 * e0 * g1 -
        c0 * e1 * g1 +
        b * f1 * g1 -
        c0 * e0 * g2 +
        b * f0 * g2 +
        c2 * d * h0 -
        a * f2 * h0 +
        c1 * d * h1 -
        a * f1 * h1 +
        c0 * d * h2 -
        a * f0 * h2 +
        a * e2 * i0 +
        a * e1 * i1 -
        b * d * i2 +
        a * e0 * i2,
      -c1 * e0 * g0 -
        c0 * e1 * g0 +
        b * f1 * g0 -
        c0 * e0 * g1 +
        b * f0 * g1 +
        c1 * d * h0 -
        a * f1 * h0 +
        c0 * d * h1 -
        a * f0 * h1 +
        a * e1 * i0 -
        b * d * i1 +
        a * e0 * i1,
      -c0 * e0 * g0 +
        b * f0 * g0 +
        c0 * d * h0 -
        a * f0 * h0 -
        b * d * i0 +
        a * e0 * i0
    );
    poly.simplifyEquals();
    const roots = poly.getRootsInInterval(0, 1);
    for (const root of roots) {
      const x = new Polynomial(
        c13.x,
        c12.x,
        c11.x,
        c10.x -
          c20.x -
          root * c21.x -
          root * root * c22.x -
          root * root * root * c23.x
      );
      x.simplifyEquals();
      const x_roots = x.getRoots();
      console.log(`x_roots ${x_roots}`);

      const y = new Polynomial(
        c13.y,
        c12.y,
        c11.y,
        c10.y -
          c20.y -
          root * c21.y -
          root * root * c22.y -
          root * root * root * c23.y
      );
      y.simplifyEquals();
      const y_roots = y.getRoots();
      console.log(`y_roots ${y_roots}`);

      if (x_roots.length > 0 && y_roots.length > 0) {
        const TOLERANCE = 1e-4;

        checkRoots: for (const x_root of x_roots) {
          if (0 <= x_root && x_root <= 1) {
            for (let k = 0; k < y_roots.length; k++) {
              // When the distance between the two roots are below the tolerance there is an intersection
              if (Math.abs(x_root - y_roots[k]) < TOLERANCE) {
                result.push({
                  point: c23
                    .multiply(root * root * root)
                    .add(
                      c22.multiply(root * root).add(c21.multiply(root).add(c20))
                    ),
                  t: x_root,
                });
                break checkRoots;
              }
            }
          }
        }
      }
    }
    return result;
  }

  public getBernsteinPolynomials(): { x: Polynomial; y: Polynomial } {
    let a, b, c;

    // Start with Bezier using Bernstein polynomials for weighting functions:
    //     (1-t^3)P1 + 3t(1-t)^2P2 + 3t^2(1-t)P3 + t^3P4
    //
    // Expand and collect terms to form linear combinations of original Bezier
    // controls.  This ends up with a vector cubic in t:
    //     (-P1+3P2-3P3+P4)t^3 + (3P1-6P2+3P3)t^2 + (-3P1+3P2)t + P1
    //             /\                  /\                /\       /\
    //             ||                  ||                ||       ||
    //             c3                  c2                c1       c0

    // Calculate the coefficients
    a = this.b0.multiply(-1);
    b = this.b1.multiply(3);
    c = this.b2.multiply(-3);
    const c3 = a.add(b.add(c.add(this.b3)));

    a = this.b0.multiply(3);
    b = this.b1.multiply(-6);
    c = this.b2.multiply(3);
    const c2 = a.add(b.add(c));

    a = this.b0.multiply(-3);
    b = this.b1.multiply(3);
    const c1 = a.add(b);

    const c0 = this.b0;

    return {
      x: new Polynomial(c3.x, c2.x, c1.x, c0.x),
      y: new Polynomial(c3.y, c2.y, c1.y, c0.y),
    };
  }

  public getBoundingBox(): BoundingBox {
    const bernstein_polynomials = this.getBernsteinPolynomials();
    const dx = bernstein_polynomials.x.getDerivative();
    const dy = bernstein_polynomials.y.getDerivative();
    let roots = dx.getRootsInInterval(0, 1);

    roots = roots.concat(dy.getRootsInInterval(0, 1));

    // initialize min/max using the first and last points on the curve
    let min = this.b0.min(this.b3);
    let max = this.b0.max(this.b3);

    // update min/max with points between p1 and p4
    roots.forEach(function (t) {
      if (0 <= t && t <= 1) {
        const testPoint = new Point2D(
          bernstein_polynomials.x.eval(t),
          bernstein_polynomials.y.eval(t)
        );

        min = min.min(testPoint);
        max = max.max(testPoint);
      }
    });

    return new BoundingBox(min.x, min.y, max.x - min.x, max.y - min.y);
  }

  public toString(): string {
    return (
      "M" +
      this.b0.x +
      "," +
      this.b0.y +
      " " +
      "C" +
      this.b1.x +
      "," +
      this.b1.y +
      " " +
      this.b2.x +
      "," +
      this.b2.y +
      " " +
      this.b3.x +
      "," +
      this.b3.y
    );
  }
}

export function pathToQuadraticBezier(path: string): QuadraticBezier | void {
  // move to
  // smooth curveto
  const result =
    /^m(\d+\.\d+|\d+),(\d+\.\d+\d+)s(\d+\.\d+|\d+),(\d+\.\d+|\d+),(\d+\.\d+|\d+),(\d+\.\d+|\d+)/.exec(
      path
    );
  console.log(result);
  if (result !== null) {
    const b0 = new Point2D(Number(result[1]), Number(result[2]));
    const b1 = new Point2D(b0.x + Number(result[3]), b0.y + Number(result[4]));
    const b2 = new Point2D(b0.x + Number(result[5]), b0.y + Number(result[6]));
    return new QuadraticBezier(b0, b1, b2);
  }
}

export class QuadraticBezier {
  b0: Point2D;
  b1: Point2D;
  b2: Point2D;
  public constructor(b0: Point2D, b1: Point2D, b2: Point2D) {
    this.b0 = b0;
    this.b1 = b1;
    this.b2 = b2;
  }

  splitAtParameter(t: number): QuadraticBezier[] {
    // first round of lerps
    const p0 = this.b0.lerp(this.b1, t);
    const p1 = this.b1.lerp(this.b2, t);

    // second round of lerps
    const q0 = p0.lerp(p1, t);

    return [
      new QuadraticBezier(this.b0, p0, q0),
      new QuadraticBezier(q0, p1, this.b2),
    ];
  }

  public intersectQuadraticBezier(that: QuadraticBezier): Intersection[] {
    if (!this.getBoundingBox().overlaps(that.getBoundingBox())) return [];
    const result: Intersection[] = [];
    let a, b;

    a = this.b1.multiply(-2);
    const c12 = this.b0.add(a.add(this.b2));

    a = this.b0.multiply(-2);
    b = this.b1.multiply(2);
    const c11 = a.add(b);

    const c10 = new Point2D(this.b0.x, this.b0.y);

    a = that.b1.multiply(-2);
    const c22 = that.b0.add(a.add(that.b2));

    a = that.b0.multiply(-2);
    b = that.b1.multiply(2);
    const c21 = a.add(b);

    const c20 = new Point2D(that.b0.x, that.b0.y);

    // bezout
    a = c12.x * c11.y - c11.x * c12.y;
    b = c22.x * c11.y - c11.x * c22.y;
    const c = c21.x * c11.y - c11.x * c21.y;
    const d = c11.x * (c10.y - c20.y) + c11.y * (-c10.x + c20.x);
    const e = c22.x * c12.y - c12.x * c22.y;
    const f = c21.x * c12.y - c12.x * c21.y;
    const g = c12.x * (c10.y - c20.y) + c12.y * (-c10.x + c20.x);

    // determinant
    const polynomial = new Polynomial(
      -e * e,
      -2 * e * f,
      a * b - f * f - 2 * e * g,
      a * c - 2 * f * g,
      a * d - g * g
    );

    const roots = polynomial.getRoots();

    for (const s of roots) {
      if (0 <= s && s <= 1) {
        const xp = new Polynomial(
          c12.x,
          c11.x,
          c10.x - c20.x - s * c21.x - s * s * c22.x
        );
        xp.simplifyEquals();
        const xRoots = xp.getRoots();
        const yp = new Polynomial(
          c12.y,
          c11.y,
          c10.y - c20.y - s * c21.y - s * s * c22.y
        );
        yp.simplifyEquals();
        const yRoots = yp.getRoots();

        if (xRoots.length > 0 && yRoots.length > 0) {
          const TOLERANCE = 1e-4;

          checkRoots: for (const xRoot of xRoots) {
            if (0 <= xRoot && xRoot <= 1) {
              for (let k = 0; k < yRoots.length; k++) {
                if (Math.abs(xRoot - yRoots[k]) < TOLERANCE) {
                  result.push({
                    point: c22.multiply(s * s).add(c21.multiply(s).add(c20)),
                    t: xRoot,
                  });
                  break checkRoots;
                }
              }
            }
          }
        }
      }
    }

    return result;
  }

  public getBernsteinPolynomials(): { x: Polynomial; y: Polynomial } {
    let a; // temporary variables

    a = this.b1.multiply(-2);
    const c2 = this.b0.add(a.add(this.b2));

    a = this.b0.multiply(-2);
    const b = this.b1.multiply(2);
    const c1 = a.add(b);

    const c0 = this.b0;

    return {
      x: new Polynomial(c2.x, c1.x, c0.x),
      y: new Polynomial(c2.y, c1.y, c0.y),
    };
  }

  public getBoundingBox(): BoundingBox {
    const polys = this.getBernsteinPolynomials();
    const dx = polys.x.getDerivative();
    const dy = polys.y.getDerivative();
    let roots = dx.getRootsInInterval(0, 1);
    roots = roots.concat(dy.getRootsInInterval(0, 1));

    let min = this.b0.min(this.b2);
    let max = this.b0.max(this.b2);

    roots.forEach(function (t) {
      if (0 <= t && t <= 1) {
        const testPoint = new Point2D(polys.x.eval(t), polys.y.eval(t));

        min = min.min(testPoint);
        max = max.max(testPoint);
      }
    });

    return new BoundingBox(min.x, min.y, max.x - min.x, max.y - min.y);
  }

  public toString() {
    return (
      "M" +
      this.b0.x +
      "," +
      this.b0.y +
      " " +
      "Q" +
      this.b1.x +
      "," +
      this.b1.y +
      " " +
      this.b2.x +
      "," +
      this.b2.y
    );
  }
}

export class Ellipse {
  center: Point2D;
  rx: number;
  ry: number;
  public constructor(center: Point2D, rx: number, ry: number) {
    this.center = center;
    this.rx = rx;
    this.ry = ry;
  }

  getBoundingBox(): BoundingBox {
    return new BoundingBox(
      this.center.x - this.rx,
      this.center.y - this.ry,
      this.rx * 2.0,
      this.ry * 2.0
    );
  }

  public intersectEllipse(that: Ellipse): Intersection[] {
    const result: Intersection[] = [];
    if (!this.getBoundingBox().overlaps(that.getBoundingBox())) {
      return result;
    }

    const a = [
      this.ry * this.ry,
      0,
      this.rx * this.rx,
      -2 * this.ry * this.ry * this.center.x,
      -2 * this.rx * this.rx * this.center.y,
      this.ry * this.ry * this.center.x * this.center.x +
        this.rx * this.rx * this.center.y * this.center.y -
        this.rx * this.rx * this.ry * this.ry,
    ];
    const b = [
      that.ry * that.ry,
      0,
      that.rx * that.rx,
      -2 * that.ry * that.ry * that.center.x,
      -2 * that.rx * that.rx * that.center.y,
      that.ry * that.ry * that.center.x * that.center.x +
        that.rx * that.rx * that.center.y * that.center.y -
        that.rx * that.rx * that.ry * that.ry,
    ];

    const polynomial_y = bezout(a, b);
    const roots_y = polynomial_y.getRoots();
    const epsilon = 1e-3;
    const norm0 = (a[0] * a[0] + 2 * a[1] * a[1] + a[2] * a[2]) * epsilon;
    const norm1 = (b[0] * b[0] + 2 * b[1] * b[1] + b[2] * b[2]) * epsilon;

    for (let y = 0; y < roots_y.length; y++) {
      const polynomial_x = new Polynomial(
        a[0],
        a[3] + roots_y[y] * a[1],
        a[5] + roots_y[y] * (a[4] + roots_y[y] * a[2])
      );
      const roots_x = polynomial_x.getRoots();

      for (let x = 0; x < roots_x.length; x++) {
        let tst =
          (a[0] * roots_x[x] + a[1] * roots_y[y] + a[3]) * roots_x[x] +
          (a[2] * roots_y[y] + a[4]) * roots_y[y] +
          a[5];
        if (Math.abs(tst) < norm0) {
          tst =
            (b[0] * roots_x[x] + b[1] * roots_y[y] + b[3]) * roots_x[x] +
            (b[2] * roots_y[y] + b[4]) * roots_y[y] +
            b[5];
          if (Math.abs(tst) < norm1) {
            result.push({
              point: new Point2D(roots_x[x], roots_y[y]),
              t: null,
            });
          }
        }
      }
    }

    return result;
  }

  public intersectQuadraticBezier(that: QuadraticBezier): Intersection[] {
    const result: Intersection[] = [];
    if (!this.getBoundingBox().overlaps(that.getBoundingBox())) {
      return [];
    }
    let a;
    a = that.b1.multiply(-2);
    const c2 = that.b0.add(a.add(that.b2));

    a = that.b0.multiply(-2);
    const b = that.b1.multiply(2);
    const c1 = a.add(b);

    const c0 = new Point2D(that.b0.x, that.b0.y);

    const rx_squared = this.rx * this.rx;
    const ry_squared = this.ry * this.ry;
    const roots = new Polynomial(
      ry_squared * c2.x * c2.x + rx_squared * c2.y * c2.y,
      2 * (ry_squared * c2.x * c1.x + rx_squared * c2.y * c1.y),
      ry_squared * (2 * c2.x * c0.x + c1.x * c1.x) +
        rx_squared * (2 * c2.y * c0.y + c1.y * c1.y) -
        2 *
          (ry_squared * this.center.x * c2.x +
            rx_squared * this.center.y * c2.y),
      2 *
        (ry_squared * c1.x * (c0.x - this.center.x) +
          rx_squared * c1.y * (c0.y - this.center.y)),
      ry_squared * (c0.x * c0.x + this.center.x * this.center.x) +
        rx_squared * (c0.y * c0.y + this.center.y * this.center.y) -
        2 *
          (ry_squared * this.center.x * c0.x +
            rx_squared * this.center.y * c0.y) -
        rx_squared * ry_squared
    ).getRoots();

    for (const t of roots) {
      if (0 <= t && t <= 1) {
        result.push({
          point: c2.multiply(t * t).add(c1.multiply(t).add(c0)),
          t: null,
        });
      }
    }

    return result;
  }

  public toBezier(): CubicBezier[] {
    // const result: CubicBezier[] = [];
    const kappa = 0.5522848; // 4 * ((√(2) - 1) / 3)
    const ox = this.rx * kappa; // control point offset horizontal
    const oy = this.ry * kappa; // control point offset vertical
    const xe = this.center.x + this.rx; // x-end
    const ye = this.center.y + this.ry; // y-end

    return [
      new CubicBezier(
        new Point2D(this.center.x - this.rx, this.center.y),
        new Point2D(this.center.x - this.rx, this.center.y - oy),
        new Point2D(this.center.x - ox, this.center.y - this.ry),
        new Point2D(this.center.x, this.center.y - this.ry)
      ),
      new CubicBezier(
        new Point2D(this.center.x, this.center.y - this.ry),
        new Point2D(this.center.x + ox, this.center.y - this.ry),
        new Point2D(xe, this.center.y - oy),
        new Point2D(xe, this.center.y)
      ),
      new CubicBezier(
        new Point2D(xe, this.center.y),
        new Point2D(xe, this.center.y + oy),
        new Point2D(this.center.x + ox, ye),
        new Point2D(this.center.x, ye)
      ),
      new CubicBezier(
        new Point2D(this.center.x, ye),
        new Point2D(this.center.x - ox, ye),
        new Point2D(this.center.x - this.rx, this.center.y + oy),
        new Point2D(this.center.x - this.rx, this.center.y)
      ),
    ];
  }
}

export class Arc {
  start: Point2D;
  rx: number;
  ry: number;
  x_axis_rotation: number;
  large_arc_flag: number;
  sweep_flag;
  end: Point2D;
  public constructor(
    start: Point2D,
    rx: number,
    ry: number,
    x_axis_rotation: number,
    large_arc_flag: number,
    sweep_flag: any,
    end: Point2D
  ) {
    this.start = start;
    this.rx = rx;
    this.ry = ry;
    this.x_axis_rotation = x_axis_rotation;
    this.large_arc_flag = large_arc_flag;
    this.sweep_flag = sweep_flag;
    this.end = end;
  }

  public toString() {
    return (
      "M" +
      this.start.x +
      " " +
      this.start.y +
      "A" +
      this.rx +
      " " +
      this.ry +
      " " +
      this.x_axis_rotation +
      " " +
      this.large_arc_flag +
      " " +
      this.sweep_flag +
      " " +
      this.end.x +
      " " +
      this.end.y
    );
  }
}

export function BeziersToPath(beziers: CubicBezier[]): string {
  if (beziers.length == 1) {
    return beziers[0].toString();
  }
  if (beziers.length == 2) {
    const P = beziers[0];
    const Q = beziers[1];
    if (P instanceof CubicBezier) {
      if (Q instanceof CubicBezier) {
        return (
          P.toString() +
          "S " +
          Q.b2.x +
          "," +
          Q.b2.y +
          " " +
          Q.b3.x +
          "," +
          Q.b3.y
        );
      }
    }
  }
  var result = ``;
  for (let index = 0; index < beziers.length - 1; index++) {
    const P = beziers[index];
    const Q = beziers[index + 1];
    if (P instanceof CubicBezier) {
      if (Q instanceof CubicBezier) {
        if (!P.b3.equals(Q.b0)) {
          throw Error("Beziers must be connected");
        }
        result +=
          P.toString() +
          "S " +
          Q.b2.x +
          "," +
          Q.b2.y +
          " " +
          Q.b3.x +
          "," +
          Q.b3.y;
      }
    }
  }
  return result;
}
