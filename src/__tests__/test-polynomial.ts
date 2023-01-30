import { Polynomial, sign } from "../Polynomial";
import { describe, expect, test } from "@jest/globals";

describe("testing sign", () => {
  test("Positive numbers return +1", () => {
    expect(sign(1)).toEqual(1);
  });

  test("Negative numbers return -1", () => {
    expect(sign(-1)).toEqual(-1);
  });

  test("The 0 value returns 0", () => {
    expect(sign(0)).toEqual(0);
  });

  test("The +0 value returns +0", () => {
    expect(sign(0)).toEqual(+0);
  });

  test("The -0 value returns 0", () => {
    expect(sign(-0)).toEqual(-0);
  });
});

describe("testing Polynomial", () => {
  test("No arguments should default to no coefficients", () => {
    const polynomial = new Polynomial();
    expect(polynomial.coefficients).toStrictEqual([]);
  });

  test("Given arguments should be in order", () => {
    const polynomial = new Polynomial(3, 2, 1);
    expect(polynomial.coefficients).toStrictEqual([1, 2, 3]);
  });

  test("The Polynomial can be represented as a string", () => {
    const polynomial = new Polynomial(3, 2, 1);
    expect(polynomial.toString()).toBe("3t^2 + 2t + 1")
  })

  test("Polynomial can be divided by a scalar", () => {
    const polynomial = new Polynomial(6, 3, 0);
    polynomial.divideEqualsScalar(3);
    expect(polynomial.coefficients).toStrictEqual([0, 1, 2]);
  });

  test("Polynomial can be evaluated", () => {
    const polynomial_a = new Polynomial(3, 2, 1);
    const polynomial_b = new Polynomial(4, 2, 1);
    expect(polynomial_a.eval(1)).toBe(6)
    expect(polynomial_a.eval(2)).toBe(17)
    expect(polynomial_b.eval(1)).toBe(7)
  })

  test("Can determine the degree of the polynomial", () => {
    const polynomial = new Polynomial(1, 2)
    expect(polynomial.getDegree()).toBe(1)
  })

  // TODO
  // test("The upper and lower bounds of the curve can be determined", () => {
  //   const polynomial = new Polynomial(1, 2)
  //   expect(polynomial.bounds()).toBe({minX: -2, maxX: -2})
  // })

  //  TODO
  //   test("Newton's method bisects a function", () => {
  //     const polynomial = new Polynomial(2, 1);
  //   });
});
