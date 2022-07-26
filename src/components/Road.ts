import { lerp } from "../utils";

export class Road {
  x: number;
  width: number;
  laneCount: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
  constructor(x: number, width: number, laneCount = 3) {
    this.x = x;
    this.width = width;
    this.laneCount = laneCount;

    this.left = x - width / 2;
    this.right = x + width / 2;

    const infinity = 1000000;
    this.top = -infinity;
    this.bottom = infinity;
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.lineWidth = 5;
    ctx.strokeStyle = "white";

    // ctx.beginPath();
    // ctx.moveTo(this.left, this.top);
    // ctx.lineTo(this.left, this.bottom);
    // ctx.stroke();
    // let index: number;
    for (let index = 0; index <= this.laneCount; index++) {
      const x = this.#linearInterpolation(
        this.left,
        this.right,
        index / this.laneCount
      );
      // console.log('x:',x,' i:',index)
      if (index > 0 && index < this.laneCount) {
        ctx.setLineDash([20, 20]);
      } else {
        ctx.setLineDash([]);
      }
      ctx.beginPath();
      ctx.moveTo(x, this.top);
      ctx.lineTo(x, this.bottom);
      ctx.stroke();
      // ctx.closePath()
    }
  }

  #linearInterpolation(left: number, right: number, lanePercent: number) {
    return lerp(left, right, lanePercent);
  }
}
