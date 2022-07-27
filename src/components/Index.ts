import { Road } from "./Road";
import { Car } from "./Car";

export default function startUpApp() {
  const canvas = <HTMLCanvasElement>document.getElementById("canvas")!;
  canvas.width = 400;

  const road = new Road(canvas.width / 2, canvas.width * 0.9);
  const traffic = [
    new Car({
      x: road.getLaneCenter(1),
      y: -100,
      width: 60,
      height: 100,
      maxSpeed: 2,
    }),
  ];
  const car = new Car({
    x: road.getLaneCenter(1),
    y: 100,
    width: 60,
    height: 100,
    controlType: "MAIN",
  });

  const ctx = canvas.getContext("2d")!;
  animate();

  function animate() {
    car.update(road.borders, traffic);
    const drawTraffic = addTraffic();

    canvas.height = window.innerHeight;
    ctx.save();
    ctx.translate(0, -car.y + canvas.height * 0.7);
    road.draw(ctx);
    drawTraffic();
    car.draw(ctx);
    requestAnimationFrame(animate);
  }

  /**
   * initially add traffic to road and update based off road BorderPostions
   * @returns a callback that draws the traffic cars on canvas
   */
  function addTraffic() {
    for (let i = 0; i < traffic.length; i++) {
      traffic[i].update(road.borders, []);
    }
    /** Draw the cars representing traffic on road */
    return () => {
      for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(ctx);
      }
    };
  }
}
