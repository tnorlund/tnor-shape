import  {Polynomial, sign} from "../Polynomial";
import { describe, expect, test } from "@jest/globals";

describe("testing sign", ()=>{
    test("Positive numbers return +1", () => {
        expect(sign(1)).toEqual(1)
    })

    test("Negative numbers return -1", () => {
        expect(sign(-1)).toEqual(-1)
    })

    test("The 0 value returns 0", () => {
        expect(sign(0)).toEqual(0)
    })

    test("The -0 value returns 0", () => {
        expect(sign(-0)).toEqual(-0)
    })
})

describe("testing Point2D", () => {
  test("No arguments should default to no coefficients", () => {
    const polynomial = new Polynomial();
    expect(polynomial.coefficients).toStrictEqual([]);
  });

  test("Given arguments should be in order", () => {
    const polynomial = new Polynomial(3, 2, 1);
    expect(polynomial.coefficients).toStrictEqual([1, 2, 3]);
  });
});
