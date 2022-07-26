import { lerp } from "../utils";
import { Car } from "./Car";
import { borderPostions } from "./Road";

/**
 * ```Sensors``` class describes the sensors (laser rays) beeming off our self driving car
 */
export class Sensor {
  /** Current `Car` instance to add Sensors on */
  car: Car;
  /** `rayCount` denotes the amount of sensor rays beeming off car */
  rayCount: number;
  /** `rayLength` denotes the how far a sensor rays reaches from the car */
  rayLength: number;
  /** `raySpreed` denotes the angle of sensor rays beeming off car defaults @45 degrees (Math.PI/4) */
  raySpreed: number;
  /**Rays array holds each rayCount Beem in each index depending on ray count */
  rays: [borderPostions, borderPostions][];

  constructor(
    car: Car,
    rayCount = 8,
    rayLength = 150,
    raySpreed = Math.PI / 2
  ) {
    this.car = car;
    this.rayCount = rayCount;
    this.rayLength = rayLength;
    this.raySpreed = raySpreed;
    this.rays = [];
  }
  update() {
    this.#castRays();
  }
  draw(ctx: CanvasRenderingContext2D) {
    let i: number;
    for (i = 0; i < this.rayCount; i++) {
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";
      ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
      ctx.lineTo(this.rays[i][1].x, this.rays[i][1].y);
      ctx.stroke();
    }
  }
  #castRays() {
    this.rays = [];
    let index: number;
    for (index = 0; index < this.rayCount; index++) {
      const rayAngle =
        lerp(
          this.raySpreed / 2,
          -this.raySpreed / 2,
          this.rayCount == 1 ? 0.5 : index / (this.rayCount - 1)
        ) + this.car.angle;
      const start = { x: this.car.x, y: this.car.y };
      const end = {
        x: this.car.x - Math.sin(rayAngle) * this.rayLength,
        y: this.car.y - Math.cos(rayAngle) * this.rayLength,
      };
      this.rays.push([start, end]);
    }
  }
}
