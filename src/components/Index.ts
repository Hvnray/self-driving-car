import { Road } from "./Road";
import { Car } from "./Car";

export default function startUpApp() {
  const canvas = <HTMLCanvasElement>document.getElementById("canvas")!;
  canvas.width = 400;

  const road = new Road(canvas.width / 2, canvas.width * 0.9);

  const car = new Car({
    x: road.getLaneCenter(1),
    y: 100,
    width: 60,
    height: 100,
  });

  const ctx = canvas.getContext("2d")!;
  animate();

  function animate() {
    car.update();

    canvas.height = window.innerHeight;
    ctx.save()
    ctx.translate(0,-car.y+canvas.height*0.7)
    road.draw(ctx);
    car.draw(ctx);
    requestAnimationFrame(animate);
  }
}
