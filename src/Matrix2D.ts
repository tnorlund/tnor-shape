import { Point2D } from "./Point2D";

export class Matrix2D {
    a: number;
    b: number;
    c: number;
    d: number;
    e: number;
    f: number;
    constructor(a = 1, b = 0, c = 0, d = 1, e = 0, f = 0) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.e = e;
        this.f = f;
    }

    public translation(tx: number | undefined, ty: number | undefined) {
        return new Matrix2D(1, 0, 0, 1, tx, ty);
    }

    public rotation(radians: number) {
        const c = Math.cos(radians);
        const s = Math.sin(radians);

        return new Matrix2D(c, s, -s, c, 0, 0);
    }

    public rotationAt(radians:number, center:Point2D) {
        const c = Math.cos(radians);
        const s = Math.sin(radians);

        return new Matrix2D(
            c,
            s,
            -s,
            c,
            center.x - center.x * c + center.y * s,
            center.y - center.y * c - center.x * s
        );
    }
}
