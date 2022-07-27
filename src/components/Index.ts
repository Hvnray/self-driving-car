import { Road } from "./Road";
import { Car } from "./Car";
import { Visualizer } from "./Visualizer";

export default function startUpApp() {
  const carCanvas = <HTMLCanvasElement>document.getElementById("carCanvas")!;
  carCanvas.width = 400;

  const networkCanvas = <HTMLCanvasElement>(
    document.getElementById("networkCanvas")!
  );
  networkCanvas.width = 500;

  const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
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

  const carCtx = carCanvas.getContext("2d")!;
  const networkCtx = networkCanvas.getContext("2d")!;
  animate();

  function animate(time?: number) {
    car.update(road.borders, traffic);
    const drawTraffic = addTraffic();

    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0, -car.y + carCanvas.height * 0.7);

    road.draw(carCtx);

    drawTraffic();

    car.draw(carCtx);
    carCtx.restore();
    networkCtx.lineDashOffset = -time!/50;
    Visualizer.drawNetwork(networkCtx, car.brain!);
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
        traffic[i].draw(carCtx);
      }
    };
  }
}
