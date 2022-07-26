import {
  BorderPostionsAndOffset,
  BordersSections,
  OrNull,
  BorderPostionsTuple,
} from "../types";
import { getIntersection, lerp } from "../utils";
import { Car } from "./Car";

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
  rays: BordersSections;
  /**`Readings` array holds each border distance from rays (used to show in rader goes past border or traffic)*/
  readings: OrNull<BorderPostionsAndOffset>[];

  constructor(
    car: Car,
    rayCount = 5,
    rayLength = 300,
    raySpreed = Math.PI / 2
  ) {
    this.car = car;
    this.rayCount = rayCount;
    this.rayLength = rayLength;
    this.raySpreed = raySpreed;
    this.rays = [];
    this.readings = [];
  }
  update(roadBorders: BordersSections, traffic: Car[]) {
    this.#castRays();
    this.#setReadings(roadBorders, traffic);
  }
  draw(ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < this.rayCount; i++) {
      let end = this.rays[i][1];
      if (this.readings[i]) {
        end = this.readings[i]!;
      }
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";
      ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "red";
      ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y);
      ctx.lineTo(end.x, end.y);
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
  #setReadings(roadBorders: BordersSections, traffic: Car[]) {
    this.readings = [];
    let index: number;
    for (index = 0; index < this.rays.length; index++) {
      this.readings.push(
        this.#getReadings(this.rays[index], roadBorders, traffic)
      );
    }
  }
  #getReadings(
    ray: BorderPostionsTuple,
    roadBorders: BordersSections,
    traffic: Car[]
  ) {
    /**used to store points where car touches either border */
    let touches: BorderPostionsAndOffset[] = [];
    for (let index = 0; index < roadBorders.length; index++) {
      const touch = getIntersection(
        ray[0],
        ray[1],
        roadBorders[index][0],
        roadBorders[index][1]
      );
      if (touch) {
        touches.push(touch);
      }
    }

    /**used to store points where car touches other cars in traffic */
    for (let i = 0; i < traffic.length; i++) {
      const polygon = traffic[i].polygon;
      for (let j = 0; j < polygon.length; j++) {
        const touch = getIntersection(
          ray[0],
          ray[1],
          polygon[j],
          polygon[(j + 1) % polygon.length]
        );
        if (touch) {
          touches.push(touch);
        }
      }
    }
    if (touches.length == 0) {
      return null;
    } else {
      const offsets = touches.map((b) => b.offset);
      const minOffset = Math.min(...offsets);
      return touches.find((b) => b.offset == minOffset)!;
    }
  }
}
