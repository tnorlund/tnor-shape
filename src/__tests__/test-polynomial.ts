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
    expect(polynomial.toString()).toBe("3t^2 + 2t + 1");
  });

  test("Polynomial can be divided by a scalar", () => {
    const polynomial = new Polynomial(6, 3, 0);
    polynomial.divideEqualsScalar(3);
    expect(polynomial.coefficients).toStrictEqual([0, 1, 2]);
  });

  test("Polynomial can be evaluated", () => {
    const polynomial_a = new Polynomial(3, 2, 1);
    const polynomial_b = new Polynomial(4, 2, 1);
    expect(polynomial_a.eval(1)).toBe(6);
    expect(polynomial_a.eval(2)).toBe(17);
    expect(polynomial_b.eval(1)).toBe(7);
  });

  test("Can determine the degree of the polynomial", () => {
    const polynomial = new Polynomial(1, 2);
    expect(polynomial.getDegree()).toBe(1);
  });

  test("The derivative of a polynomial can be found", () => {
    const polynomial = new Polynomial(3, 2, 1);
    const polynomial_derivative = new Polynomial(6, 2);
    expect(polynomial.getDerivative()).toEqual(polynomial_derivative);
  });

  test("Can calculate the linear root", () => {
    const polynomial = new Polynomial(3, 6);
    expect(polynomial.getLinearRoot()).toStrictEqual([-2]);
  });

  test("An empty array is returned when no linear root exists", () => {
    const polynomial = new Polynomial(0, 0);
    expect(polynomial.getLinearRoot()).toStrictEqual([]);
  });

  test("The coefficients can be simplified when bellow the default tolerance", () => {
    const polynomial = new Polynomial(4e-14, 3);
    polynomial.simplifyEquals();
    const simplified_polynomial = new Polynomial(3);
    expect(polynomial).toStrictEqual(simplified_polynomial);
  });

  test("The coefficients can be simplified when bellow the given tolerance", () => {
    const polynomial = new Polynomial(2, 3);
    polynomial.simplifyEquals(2);
    const simplified_polynomial = new Polynomial(3);
    expect(polynomial).toStrictEqual(simplified_polynomial);
  });

  test("The Quadratic roots can be calculated when there are 2 roots", () => {
    const polynomial = new Polynomial(1, -7, 10);
    expect(polynomial.getQuadraticRoots()).toStrictEqual([5, 2]);
  });

  test("The Quadratic roots can be calculated when there is 1 root", () => {
    const polynomial = new Polynomial(1, -2, 1);
    expect(polynomial.getQuadraticRoots()).toStrictEqual([1]);
  });

  test("The cubic roots can be calculated when the discriminant is 0", () => {
    const polynomial = new Polynomial(1, 0, 0, 0);
    expect(polynomial.getCubicRoots()).toStrictEqual([-0, 0]);
  });

  test("The cubic roots can be calculated", () => {
    const polynomial = new Polynomial(1, 0, 2, 0);
    expect(polynomial.getCubicRoots()).toStrictEqual([0]);
  });

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
