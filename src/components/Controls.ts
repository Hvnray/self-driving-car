/**
 * Controls class describes the Button Controls for Moving our Car around the Canvas(Road)
 */
export class Controls {
  /** `forward` indicates the car Up arrow Key is being pressed down, thus car is moving up on canvas */
  forward: boolean;
  /** `reverse` indicates the car Down arrow Key is being pressed down, thus car is moving in down on canvas */
  reverse: boolean;
  /** `right` indicates the car Right arrow Key is being pressed down, thus car is moving right on canvas */
  right: boolean;
  /** `left` indicates the car Left arrow Key is being pressed down, thus car is moving left on canvas */
  left: boolean;

  constructor() {
    this.forward = false;
    this.reverse = false;
    this.left = false;
    this.right = false;
    this.#addKeyboardEventListener();
  }
  /** `#addKeyboardEventListener` private method attaches event listener to arrow keys */
  #addKeyboardEventListener() {
    document.onkeydown = (ev) => {
      switch (ev.key) {
        case "ArrowUp":
          this.forward = true;
          break;
        case "ArrowDown":
          this.reverse = true;
          break;

        case "ArrowLeft":
          this.left = true;
          break;

        case "ArrowRight":
          this.right = true;
          break;

        default:
          break;
      }
    };

    document.onkeyup = (ev) => {
      switch (ev.key) {
        case "ArrowUp":
          this.forward = false;
          break;
        case "ArrowDown":
          this.reverse = false;
          break;

        case "ArrowLeft":
          this.left = false;
          break;

        case "ArrowRight":
          this.right = false;
          break;

        default:
          break;
      }
    };
  }
}
