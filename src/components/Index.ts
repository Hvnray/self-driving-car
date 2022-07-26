import { Road } from "./Road";
import { Car } from "./Car";

export default function startUpApp() {
  const canvas = <HTMLCanvasElement>document.getElementById("canvas")!;
  canvas.width = 400;

  const road = new Road(canvas.width / 2, canvas.width * 0.9);

  const car = new Car({
    x: road.getLaneCenter(1),
    y: 100,
    width: 30,
    height: 50,
  });

  const ctx = canvas.getContext("2d")!;
  animate();

  function animate() {
    car.update();

    canvas.height = window.innerHeight;
    road.draw(ctx);
    car.draw(ctx);
    requestAnimationFrame(animate);
  }
}
