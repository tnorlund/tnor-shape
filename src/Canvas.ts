import { Arc, CubicBezier, Ellipse, Line, QuadraticBezier } from "./Shape";

export class Canvas {
  width: number;
  height: number;

  constructor(height: number, width: number) {
    this.height = height;
    this.width = width;
  }

  public onCanvas(
    shape: Line | CubicBezier | QuadraticBezier | Ellipse
  ): boolean {
    const shape_bbox = shape.getBoundingBox();
    return (
      shape_bbox.x > 0 &&
      shape_bbox.y > 0 && // top left
      shape_bbox.width + shape_bbox.x < this.width &&
      shape_bbox.y > 0 && // top right
      shape_bbox.width + shape_bbox.x < this.width &&
      shape_bbox.height + shape_bbox.y < this.height && // bottom right
      shape_bbox.x > 0 &&
      shape_bbox.height + shape_bbox.y < this.height // bottom left
    );
  }

  public toSVGTag(): string {
    return (
      `<svg id="Layer_2" data-name="Layer 2" ` +
      `width="${this.width}mm" ` +
      `height="${this.height}mm" ` +
      `viewBox="0 0 ${this.width} ${this.height}" ` +
      `version="1.1" ` +
      `sodipodi:docname="example.svg" ` +
      `inkscape:version="1.2.2 (b0a84865, 2022-12-01)" ` +
      `xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" ` +
      `xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" ` +
      `xmlns="http://www.w3.org/2000/svg" ` +
      `xmlns:svg="http://www.w3.org/2000/svg">`
    );
  }
}
