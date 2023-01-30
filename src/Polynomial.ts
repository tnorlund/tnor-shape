/**
 *
 * @param x The number used to compare the sign of
 * @returns Sign of a number (+1, -1, +0, -0).
 */
export function sign(x: number): number {
  // eslint-disable-next-line no-self-compare
  return typeof x === "number"
    ? x
      ? x < 0
        ? -1
        : 1
      : x === x
      ? x
      : NaN
    : NaN;
}

export class Polynomial {
  public coefficients: number[];
  private _variable: string;
  private _s: number;
  /**
   *
   * @param coefficients The array of number that determine the coefficients
   */
  constructor(...coefficients: number[]) {
    this.coefficients = [];

    for (let i = coefficients.length - 1; i >= 0; i--) {
      this.coefficients.push(coefficients[i]);
    }

    this._variable = "t";
    this._s = 0;
  }

  /**
   *
   * @returns {string} A string representation of the polynomial
   */
  toString(): string {
    const coefficients: string[] = [];
    const signs: string[] = [];

    for (let i = this.coefficients.length - 1; i >= 0; i--) {
      let value: number = Math.round(this.coefficients[i] * 1000) / 1000;
      let value_representation: string = "";

      // Add the string representation when the coefficient is not 0
      if (value !== 0) {
        const signString = value < 0 ? " - " : " + ";
        value = Math.abs(value);
        value_representation = Math.abs(value).toString();
        // How to represent the coefficient
        if (i > 0) {
          value_representation =
            value === 1 ? this._variable : value.toString() + this._variable;
        }

        // Add the degree to the variable
        if (i > 1) {
          value_representation += "^" + i.toString();
        }

        signs.push(signString);
        coefficients.push(value_representation);
      }
    }

    signs[0] = signs[0] === " + " ? "" : "-";

    let result = "";

    for (let i = 0; i < coefficients.length; i++) {
      result += signs[i] + coefficients[i];
    }

    return result;
  }

  /**
   * Divides each coefficient by a scalar
   * @param scalar
   */
  divideEqualsScalar(scalar: number) {
    for (let i = 0; i < this.coefficients.length; i++) {
      this.coefficients[i] /= scalar;
    }
  }

  eval(x: number) {
    if (isNaN(x)) {
      throw new TypeError(`Parameter must be a number. Found '${x}'`);
    }

    let result = 0;

    for (let i = this.coefficients.length - 1; i >= 0; i--) {
      result = result * x + this.coefficients[i];
    }

    return result;
  }

  getDegree(): number {
    return this.coefficients.length - 1;
  }

  bounds() {
    const urb = this.boundsUpperRealFujiwara();
    const rb = { minX: urb.negX, maxX: urb.posX };

    if (urb.negX === 0 && urb.posX === 0) {
      return rb;
    }

    if (urb.negX === 0) {
      rb.minX = this.boundsLowerRealFujiwara().posX;
    } else if (urb.posX === 0) {
      rb.maxX = this.boundsLowerRealFujiwara().negX;
    }

    if (rb.minX > rb.maxX) {
      rb.minX = rb.maxX = 0;
    }

    return rb;
    // TODO: if sure that there are no complex roots
    // (maybe by using Sturm's theorem) use:
    // return this.boundsRealLaguerre();
  }

  boundsLowerRealFujiwara() {
    const poly = new Polynomial();

    poly.coefficients = this.coefficients.slice().reverse();

    const res = poly.boundsUpperRealFujiwara();

    res.negX = 1 / res.negX;
    res.posX = 1 / res.posX;

    return res;
  }

  getDerivative(): Polynomial {
    const derivative = new Polynomial();

    for (let i = 1; i < this.coefficients.length; i++) {
      derivative.coefficients.push(i * this.coefficients[i]);
    }

    return derivative;
  }

  getQuarticRoots() {
    let results: number[] = [];
    const n = this.getDegree();

    if (n === 4) {
      const poly = new Polynomial();

      poly.coefficients = this.coefficients.slice();
      poly.divideEqualsScalar(poly.coefficients[n]);

      const TOLERANCE = 1e-15;

      if (
        Math.abs(poly.coefficients[0]) <
        10 * TOLERANCE * Math.abs(poly.coefficients[3])
      ) {
        poly.coefficients[0] = 0;
      }

      const poly_d = poly.getDerivative();
      const derrt = poly_d.getRoots().sort((a, b) => a - b);
      const dery = [];
      const nr = derrt.length - 1;
      const rb = this.bounds();

      const maxabsX = Math.max(Math.abs(rb.minX), Math.abs(rb.maxX));
      const ZEROepsilon = this.zeroErrorEstimate(maxabsX);

      for (let i = 0; i <= nr; i++) {
        dery.push(poly.eval(derrt[i]));
      }

      for (let i = 0; i <= nr; i++) {
        if (Math.abs(dery[i]) < ZEROepsilon) {
          dery[i] = 0;
        }
      }

      let i = 0;
      const dx = Math.max((0.1 * (rb.maxX - rb.minX)) / n, TOLERANCE);
      const guesses = [];
      const minmax = [];

      if (nr > -1) {
        if (dery[0] !== 0) {
          if (sign(dery[0]) !== sign(poly.eval(derrt[0] - dx) - dery[0])) {
            guesses.push(derrt[0] - dx);
            minmax.push([rb.minX, derrt[0]]);
          }
        } else {
          results.push(derrt[0], derrt[0]);
          i++;
        }

        for (; i < nr; i++) {
          if (dery[i + 1] === 0) {
            results.push(derrt[i + 1], derrt[i + 1]);
            i++;
          } else if (sign(dery[i]) !== sign(dery[i + 1])) {
            guesses.push((derrt[i] + derrt[i + 1]) / 2);
            minmax.push([derrt[i], derrt[i + 1]]);
          }
        }
        if (
          dery[nr] !== 0 &&
          sign(dery[nr]) !== sign(poly.eval(derrt[nr] + dx) - dery[nr])
        ) {
          guesses.push(derrt[nr] + dx);
          minmax.push([derrt[nr], rb.maxX]);
        }
      }

      /**
       *  @param {number} x
       *  @returns {number}
       */
      const f = function (x: number) {
        return poly.eval(x);
      };

      /**
       *  @param {number} x
       *  @returns {number}
       */
      const df = function (x: number) {
        return poly_d.eval(x);
      };

      if (guesses.length > 0) {
        for (i = 0; i < guesses.length; i++) {
          guesses[i] = Polynomial.newtonSecantBisection(
            guesses[i],
            f,
            df,
            32,
            minmax[i][0],
            minmax[i][1]
          );
        }
      }

      results = results.concat(guesses);
    }

    return results;
  }

  bisection(min: number, max: number, TOLERANCE = 1e-6, ACCURACY = 15) {
    let minValue = this.eval(min);
    let maxValue = this.eval(max);
    let result;

    if (Math.abs(minValue) <= TOLERANCE) {
        result = min;
    }
    else if (Math.abs(maxValue) <= TOLERANCE) {
        result = max;
    }
    else if (minValue * maxValue <= 0) {
        const tmp1 = Math.log(max - min);
        const tmp2 = Math.LN10 * ACCURACY;
        const maxIterations = Math.ceil((tmp1 + tmp2) / Math.LN2);

        for (let i = 0; i < maxIterations; i++) {
            result = 0.5 * (min + max);
            const value = this.eval(result);

            if (Math.abs(value) <= TOLERANCE) {
                break;
            }

            if (value * minValue < 0) {
                max = result;
                maxValue = value;
            }
            else {
                min = result;
                minValue = value;
            }
        }
    }

    return result;
}

  /**
   *  Newton's (Newton-Raphson) method for finding Real roots on univariate function. <br/>
   *  When using bounds, algorithm falls back to secant if newton goes out of range.
   *  Bisection is fallback for secant when determined secant is not efficient enough.
   *  @see {@link http://en.wikipedia.org/wiki/Newton%27s_method}
   *  @see {@link http://en.wikipedia.org/wiki/Secant_method}
   *  @see {@link http://en.wikipedia.org/wiki/Bisection_method}
   */
  static newtonSecantBisection(
    x0: number,
    f: Function,
    df: Function,
    max_iterations: number,
    min: number,
    max: number
  ) {
    let x: number,
      prev_dfx = 0,
      dfx,
      prev_x_ef_correction = 0,
      x_correction: number,
      x_new;
    let y, y_atmin, y_atmax;

    x = x0;

    const ACCURACY = 14;
    const min_correction_factor = Math.pow(10, -ACCURACY);
    const isBounded = typeof min === "number" && typeof max === "number";

    if (isBounded) {
      if (min > max) {
        throw new RangeError("Min must be greater than max");
      }

      y_atmin = f(min);
      y_atmax = f(max);

      if (sign(y_atmin) === sign(y_atmax)) {
        throw new RangeError("Y values of bounds must be of opposite sign");
      }
    }

    const isEnoughCorrection = function () {
      // stop if correction is too small or if correction is in simple loop
      return (
        Math.abs(x_correction) <= min_correction_factor * Math.abs(x) ||
        prev_x_ef_correction === x - x_correction - x
      );
    };

    for (let i = 0; i < max_iterations; i++) {
      dfx = df(x);

      if (dfx === 0) {
        if (prev_dfx === 0) {
          // error
          throw new RangeError("df(x) is zero");
        } else {
          // use previous derivation value
          dfx = prev_dfx;
        }
        // or move x a little?
        // dfx = df(x != 0 ? x + x * 1e-15 : 1e-15);
      }

      prev_dfx = dfx;
      y = f(x);
      x_correction = y / dfx;
      x_new = x - x_correction;

      if (isEnoughCorrection()) {
        break;
      }

      if (isBounded) {
        if (sign(y) === sign(y_atmax)) {
          max = x;
          y_atmax = y;
        } else if (sign(y) === sign(y_atmin)) {
          min = x;
          y_atmin = y;
        } else {
          x = x_new;
          break;
        }

        if (x_new < min || x_new > max) {
          if (sign(y_atmin) === sign(y_atmax)) {
            break;
          }

          const RATIO_LIMIT = 50;
          const AIMED_BISECT_OFFSET = 0.25; // [0, 0.5)
          const dy = y_atmax - y_atmin;
          const dx = max - min;

          if (dy === 0) {
            x_correction = x - (min + dx * 0.5);
          } else if (Math.abs(dy / Math.min(y_atmin, y_atmax)) > RATIO_LIMIT) {
            x_correction =
              x -
              (min +
                dx *
                  (0.5 +
                    (Math.abs(y_atmin) < Math.abs(y_atmax)
                      ? -AIMED_BISECT_OFFSET
                      : AIMED_BISECT_OFFSET)));
          } else {
            x_correction = x - (min - (y_atmin / dy) * dx);
          }
          x_new = x - x_correction;

          if (isEnoughCorrection()) {
            break;
          }
        }
      }

      prev_x_ef_correction = x - x_new;
      x = x_new;
    }

    return x;
  }

  /**
   * Calculates upper Real roots bounds.
   * Real roots are in interval [negX, posX]. Determined by Fujiwara method.
   * @link http://en.wikipedia.org/wiki/Properties_of_polynomial_roots
   *
   * @returns
   */
  boundsUpperRealFujiwara() {
    let a = this.coefficients;
    const n = a.length - 1;
    const an = a[n];

    if (an !== 1) {
      a = this.coefficients.map((v) => v / an);
    }

    const b = a.map((v, i) => {
      return i < n ? Math.pow(Math.abs(i === 0 ? v / 2 : v), 1 / (n - i)) : v;
    });

    let coefficientSelectionFunction: (arg0: any) => any;
    const find2Max = function (
      acc: { max: number; near_max: number },
      bi: number,
      i: any
    ) {
      if (coefficientSelectionFunction(i)) {
        if (acc.max < bi) {
          acc.near_max = acc.max;
          acc.max = bi;
        } else if (acc.near_max < bi) {
          acc.near_max = bi;
        }
      }
      return acc;
    };

    coefficientSelectionFunction = function (i) {
      return i < n && a[i] < 0;
    };
    // eslint-disable-next-line unicorn/no-fn-reference-in-iterator
    const max_near_max_pos = b.reduce(find2Max, { max: 0, near_max: 0 });

    coefficientSelectionFunction = function (i) {
      return i < n && (n % 2 === i % 2 ? a[i] < 0 : a[i] > 0);
    };

    // eslint-disable-next-line unicorn/no-fn-reference-in-iterator
    const max_near_max_neg = b.reduce(find2Max, { max: 0, near_max: 0 });

    return {
      negX: -2 * max_near_max_neg.max,
      posX: 2 * max_near_max_pos.max,
    };
  }

  /**
   * Calculates the linear root, the x value when y is 0.
   * @returns
   */
  getLinearRoot(): number[] {
    const result = [];
    const a = this.coefficients[1];

    if (a !== 0) {
      result.push(-this.coefficients[0] / a);
    }

    return result;
  }

  simplifyEquals(TOLERANCE = 1e-12) {
    for (let i = this.getDegree(); i >= 0; i--) {
      if (Math.abs(this.coefficients[i]) <= TOLERANCE) {
        this.coefficients.pop();
      } else {
        break;
      }
    }
  }

  getRoots(): number[] {
    let result: number[] = [];

    // TODO
    this.simplifyEquals();

    switch (this.getDegree()) {
      case 0:
        result = [];
        break;
      case 1:
        result = this.getLinearRoot();
        break;
      case 2:
        result = this.getQuadraticRoots();
        break;
      case 3:
        result = this.getCubicRoots();
        break;
      case 4:
        result = this.getQuarticRoots();
        break;
      default:
        result = [];
    }

    return result;
  }

  getRootsInInterval(min: number, max: number) {
    const roots: number[] = [];

    /**
     *  @param {number} value
     */
    function push(value: number | undefined) {
        if (typeof value === "number") {
            roots.push(value);
        }
    }

    if (this.getDegree() === 0) {
        throw new RangeError("Unexpected empty polynomial");
    }
    else if (this.getDegree() === 1) {
        push(this.bisection(min, max));
    }
    else {
        // get roots of derivative
        const deriv = this.getDerivative();
        const droots = deriv.getRootsInInterval(min, max);

        if (droots.length > 0) {
            // find root on [min, droots[0]]
            push(this.bisection(min, droots[0]));

            // find root on [droots[i],droots[i+1]] for 0 <= i <= count-2
            for (let i = 0; i <= droots.length - 2; i++) {
                push(this.bisection(droots[i], droots[i + 1]));
            }

            // find root on [droots[count-1],xmax]
            push(this.bisection(droots[droots.length - 1], max));
        }
        else {
            // polynomial is monotone on [min,max], has at most one root
            push(this.bisection(min, max));
        }
    }

    return roots;
}

  getQuadraticRoots(): number[] {
    const results: number[] = [];

    if (this.getDegree() === 2) {
      const a = this.coefficients[2];
      const b = this.coefficients[1] / a;
      const c = this.coefficients[0] / a;
      const d = b * b - 4 * c;

      if (d > 0) {
        const e: number = Math.sqrt(d);

        results.push(0.5 * (-b + e));
        results.push(0.5 * (-b - e));
      } else if (d === 0) {
        // really two roots with same value, but we only return one
        results.push(0.5 * -b);
      }
      // else imaginary results
    }

    return results;
  }

  getCubicRoots(): number[] {
    const results = [];

    if (this.getDegree() === 3) {
      const c3 = this.coefficients[3];
      const c2 = this.coefficients[2] / c3;
      const c1 = this.coefficients[1] / c3;
      const c0 = this.coefficients[0] / c3;

      const a = (3 * c1 - c2 * c2) / 3;
      const b = (2 * c2 * c2 * c2 - 9 * c1 * c2 + 27 * c0) / 27;
      const offset = c2 / 3;
      let discriminant = (b * b) / 4 + (a * a * a) / 27;
      const halfB = b / 2;

      const ZEROepsilon = this.zeroErrorEstimate(undefined);

      if (Math.abs(discriminant) <= ZEROepsilon) {
        discriminant = 0;
      }

      if (discriminant > 0) {
        const e = Math.sqrt(discriminant);
        let root; // eslint-disable-line no-shadow

        let tmp = -halfB + e;

        if (tmp >= 0) {
          root = Math.pow(tmp, 1 / 3);
        } else {
          root = -Math.pow(-tmp, 1 / 3);
        }

        tmp = -halfB - e;

        if (tmp >= 0) {
          root += Math.pow(tmp, 1 / 3);
        } else {
          root -= Math.pow(-tmp, 1 / 3);
        }

        results.push(root - offset);
      } else if (discriminant < 0) {
        const distance = Math.sqrt(-a / 3);
        const angle = Math.atan2(Math.sqrt(-discriminant), -halfB) / 3;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const sqrt3 = Math.sqrt(3);

        results.push(2 * distance * cos - offset);
        results.push(-distance * (cos + sqrt3 * sin) - offset);
        results.push(-distance * (cos - sqrt3 * sin) - offset);
      } else {
        let tmp;

        if (halfB >= 0) {
          tmp = -Math.pow(halfB, 1 / 3);
        } else {
          tmp = Math.pow(-halfB, 1 / 3);
        }

        results.push(2 * tmp - offset);
        // really should return next root twice, but we return only one
        results.push(-tmp - offset);
      }
    }

    return results;
  }

  clone(): Polynomial {
    const poly = new Polynomial();

    poly.coefficients = this.coefficients.slice();

    return poly;
}

  /**
   * Estimate what is the maximum polynomial evaluation error value under which polynomial evaluation could be in fact 0.
   * @param maxAbsX
   * @returns
   */
  zeroErrorEstimate(maxAbsX: any) {
    // const poly = this;
    // const poly = new Polynomial(this.coefficients...)
    const poly = this.clone()
    const TOLERANCE = 1e-15;

    if (typeof maxAbsX === "undefined") {
      const rb = poly.bounds();

      maxAbsX = Math.max(Math.abs(rb.minX), Math.abs(rb.maxX));
    }

    if (maxAbsX < 0.001) {
      return 2 * Math.abs(poly.eval(TOLERANCE));
    }

    const n = poly.coefficients.length - 1;
    const an = poly.coefficients[n];

    return (
      10 *
      TOLERANCE *
      poly.coefficients.reduce((m, v, i) => {
        const nm = (v / an) * Math.pow(maxAbsX, i);
        return nm > m ? nm : m;
      }, 0)
    );
  }
}
