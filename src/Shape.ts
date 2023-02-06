import { Point2D } from "./Point2D";
import { Polynomial } from "./Polynomial";

interface Intersection {
  point: Point2D;
  t: number;
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

  public intersectQuadraticBezier(that: QuadraticBezier): Intersection[] {
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
                    t: xRoot
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
}
