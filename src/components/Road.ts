import { lerp } from "../utils";

/**
 * Represents the border
 */
export interface borderPostions {
  /**`x` represents the horizontal axis, left - right  */
  x: number;
  /**`y` represents the vertical axis, top - bottom  */
  y: number;
}
export class Road {
  x: number;
  width: number;
  laneCount: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
  borders: [borderPostions, borderPostions][];
  constructor(x: number, width: number, laneCount = 3) {
    this.x = x;
    this.width = width;
    this.laneCount = laneCount;

    this.left = x - width / 2;
    this.right = x + width / 2;

    const infinity = 1000000;
    this.top = -infinity;
    this.bottom = infinity;

    const topLeft: borderPostions = { x: this.left, y: this.top };
    const topRight: borderPostions = { x: this.right, y: this.top };
    const bottomLeft: borderPostions = { x: this.left, y: this.bottom };
    const bottomRight: borderPostions = { x: this.right, y: this.bottom };

    this.borders = [
      [topLeft, bottomLeft],
      [topRight, bottomRight],
    ];
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.lineWidth = 5;
    ctx.strokeStyle = "white";

    // ctx.beginPath();
    // ctx.moveTo(this.left, this.top);
    // ctx.lineTo(this.left, this.bottom);
    // ctx.stroke();
    let index: number;
    // draw the lanes without drawing the boarders
    for (index = 1; index < this.laneCount; index++) {
      const x = this.#linearInterpolation(
        this.left,
        this.right,
        index / this.laneCount
      );
      ctx.setLineDash([20, 20]);
      ctx.beginPath();
      ctx.moveTo(x, this.top);
      ctx.lineTo(x, this.bottom);
      ctx.stroke();
      // ctx.closePath()
    }

    //draw the borders
    ctx.setLineDash([]);
    this.borders.forEach((border) => {
      ctx.beginPath();
      ctx.moveTo(border[0].x, border[0].y);
      ctx.lineTo(border[1].x, border[1].y);
      ctx.stroke();
    });
  }
  getLaneCenter(laneIndex: number) {
    const laneWidth = this.width / this.laneCount;
    return (
      this.left +
      laneWidth / 2 +
      Math.min(laneIndex, this.laneCount - 1) * laneWidth
    );
  }
  #linearInterpolation(left: number, right: number, lanePercent: number) {
    return lerp(left, right, lanePercent);
  }
}
