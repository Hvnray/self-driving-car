import { CarConfig, BordersSections, CarPolygonPoints } from "../types";
import { polygonsIntersect } from "../utils";
import { Controls } from "./Controls";
import { Sensor } from "./Sensor";

/**
 * @class Car class to create car and add functionality of car
 */
export class Car {
  /** denotes the horizontal axis of the car i.e left to right */
  x: number;
  /** denotes the vertical axis of the car i.e top to bottom */
  y: number;
  /** denotes the width in px of the car*/
  width: number;
  /** denotes the height in px of the car*/
  height: number;
  /** Monitors the controls of car, used to move car on canvas based of arrow inputs */
  controls: Controls;
  /** the speed at which the car is travelling */
  speed: number = 0;
  /** Denotes the change in speed of the car */
  acceleration: number = 0.2;
  /** Denotes the Maximum speed the car can reach */
  maxSpeed: number;
  /** Denotes the friction car would apply to road */
  friction: number = 0.05;
  /**angle of the car */
  angle: number = 0;
  /** Used for car sensors(rays beaming off car) */
  sensor: Sensor;
  /**Used to evaluate if car gets damaged */
  isDamaged: boolean;
  /**Used to map points of the car */
  polygon: CarPolygonPoints[] = [];

  /**
   * Create a car.
   * @implements {CarConfig}
   * @param {number} parameters.x - The initial horizontal axis of the car i.e left to right.
   * @param {number} parameters.y - The initial vertical axis of the car i.e top to bottom.
   * @param {number} parameters.width - The width of the car.
   * @param {number} parameters.height - The height of the car.
   * @param {number} parameters.controlType - Sets controlType for Current Car.
   * @param {number} parameters.maxSpeed - The height of the car.
   */
  constructor(parameters: CarConfig) {
    this.x = parameters.x;
    this.y = parameters.y;
    this.width = parameters.width;
    this.height = parameters.height;
    this.maxSpeed = parameters.maxSpeed || 3;
    this.isDamaged = false;
    this.sensor = new Sensor(this);
    this.controls = new Controls(parameters.controlType || "DUMMY");
  }
  /** Draw the car on a given canvas */
  draw(ctx: CanvasRenderingContext2D) {
    //Removed cause now we draw the car based of the polygon points so we can track the points
    // ctx.save();
    // ctx.translate(this.x, this.y);
    // ctx.rotate(-this.angle);

    // ctx.beginPath();
    // ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    // ctx.fill();
    // ctx.restore();

    //set the fill color of car incase car is damageds
    if (this.isDamaged) {
      ctx.fillStyle = "red";
    } else {
      ctx.fillStyle = "black";
    }
    //draw car based of polygon points
    ctx.beginPath();
    //move to top right
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
    //draw line to remaning polygon points
    for (let index = 1; index < this.polygon.length; index++) {
      ctx.lineTo(this.polygon[index].x, this.polygon[index].y);
    }
    ctx.fill();

    this.sensor.draw(ctx);
  }
  /** Update and apply the various changes on car */
  update(roadBorders: BordersSections) {
    if (!this.isDamaged) {
      this.#move();
      this.polygon = this.#createPolygon();
      this.isDamaged = this.#assessDamages(roadBorders);
    }
    // else {
    //   if (window.confirm("Your Car is Destroyed, Do you want to Fix?")) {
    //     this.x =road.getLaneCenter(1)
    //     this.isDamaged = false;
    //   }
    // }
    this.sensor.update(roadBorders);
  }
  /**
   * Check if car colides with borders and traffic and deal damage
   * @param {BordersSections} roadBorders the road boarders to check if car collides
   * @returns {boolean} true if touches borders else false
   */
  #assessDamages(roadBorders: BordersSections): boolean {
    for (let index = 0; index < roadBorders.length; index++) {
      if (polygonsIntersect(this.polygon, roadBorders[index])) {
        return true;
      }
    }
    return false;
  }
  /** Creates the current points(borders?) of the car
   * @return {CarPolygonPoints[]} the new points(polygon) of car
   */
  #createPolygon(): CarPolygonPoints[] {
    /**array to save each sides(points) of the car*/
    const points: CarPolygonPoints[] = [];

    /**get the radius of the car by getting the hypothenus (diameter) of object(car) and divide by 2*/
    const radius = Math.hypot(this.width, this.height) / 2;

    /**Get the angle of the radius on the car */
    const alpha = Math.atan2(this.width, this.height);

    points.push({
      side: "topRight",
      x: this.x - Math.sin(this.angle - alpha) * radius,
      y: this.y - Math.cos(this.angle - alpha) * radius,
    });
    points.push({
      side: "topLeft",
      x: this.x - Math.sin(this.angle + alpha) * radius,
      y: this.y - Math.cos(this.angle + alpha) * radius,
    });
    points.push({
      side: "bottomRight", //Math.PI adds 180 degrees to angle so it reflects the bottom
      x: this.x - Math.sin(Math.PI + this.angle - alpha) * radius,
      y: this.y - Math.cos(Math.PI + this.angle - alpha) * radius,
    });
    points.push({
      side: "bottomLeft", //Math.PI adds 180 degrees to angle so it reflects the bottom
      x: this.x - Math.sin(Math.PI + this.angle + alpha) * radius,
      y: this.y - Math.cos(Math.PI + this.angle + alpha) * radius,
    });

    return points;
  }
  /** Move the car based of the change in Car.controls */
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
