import { BordersSections, CarConfig } from "../types";
import { Controls } from "./Controls";
import { Sensor } from "./Sensor";

export class Car {
  x: number;
  y: number;
  width: number;
  height: number;
  controls: Controls;
  speed: number = 0;
  acceleration: number = 0.2;
  maxSpeed: number = 3;
  friction: number = 0.05;
  angle: number = 0;
  sensor: Sensor;

  constructor(parameters: CarConfig) {
    this.x = parameters.x;
    this.y = parameters.y;
    this.width = parameters.width;
    this.height = parameters.height;
    this.sensor = new Sensor(this);
    this.controls = new Controls();
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(-this.angle);

    ctx.beginPath();
    ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.fill();
    ctx.restore();
    this.sensor.draw(ctx);
  }
  update(roadBorders: BordersSections) {
    this.#move();
    this.sensor.update(roadBorders);
  }
  #move() {
    /**Foward and reverse implmentation */
    if (this.controls.forward) {
      this.speed += this.acceleration;
      // this.y -= 2;
    }
    if (this.controls.reverse) {
      this.speed -= this.acceleration;
      // this.y += 2;
    }
    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    }
    /**Define max reverse speed to half of max acceleration */
    if (this.speed < -this.maxSpeed / 2) {
      this.speed = -this.maxSpeed / 2;
    }
    if (this.speed > 0) {
      this.speed -= this.friction;
    }
    if (this.speed < 0) {
      this.speed += this.friction;
    }
    if (Math.abs(this.friction) < this.friction) {
      this.speed = 0;
    }
    /** End Foward and reverse implementation */

    /**Left and Right implementation */
    if (this.speed != 0) {
      // use flip to determiine if car is reversing so we can flip the postioning
      const flip = this.speed > 0 ? 1 : -1;
      if (this.controls.left) {
        // this.x -= 2;
        this.angle += 0.03 * flip;
      }
      if (this.controls.right) {
        this.angle -= 0.03 * flip;
        // this.x += 2;
      }
    }

    // this.y -= this.speed;
    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
    // console.table(this,['property','value'])
  }
}
