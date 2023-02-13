/**
 * @author gh-jpkt
 * @file modules/canvas 0.1.0
 * @summary JavaScript module that contains simple classes
 *     for animations on a 2D canvas.
 *
 * ```yaml
 * created: 2023-02-13
 * last-updated: 2023-02-13
 * author:
 * title:
 * digest:
 * ```
*/
'use strict';

/** Represents a request for an animation frame. */
class Frame {
  /**
   * A promise that fulfills when the browser gets ready to repaint
   * or the request is canceled.
   * It fulfills with the timestamp indicating when the animation starts,
   * or `null` if the request is canceled.
   * @type {Promise}
   */
  p;
  /**
   * The request ID for the animation frame.
   * @type {number}
   */
  #requestID;
  /**
   * A function that cancels the request.
   */
  cancel;
  /** Creates a Frame object and requests an animation frame. */
  constructor() {
    this.p = new Promise((resolve) => {
      this.#requestID = window.requestAnimationFrame(resolve);
      this.cancel = () => {
        window.cancelAnimationFrame(this.#requestID);
        resolve(null);
      };
    });
  }
}

/**
 * Creates a matrix that transforms a default grid ((0, 0) to
 * (<var>width</var>, <var>height</var>)) to a simple grid ((-1, -1) to
 * (1, 1)).
 * @param {number} width
 * @param {number} height
 * @return {DOMMatrixInit}
 */
const simplifyGrid = (width, height) => {
  const hW = width / 2;
  const hH = height / 2;
  return {
    a: hW, c: 0, e: hW,
    b: 0, d: hH, f: hH,
  };
};

/** Represents a 2D canvas. */
class Simple2D {
  /**
   * The `<canvas>` element.
   * @type {HTMLCanvasElement}
   */
  #elm;
  /**
   * The context for the `<canvas>` element.
   * @type {CanvasRenderingContext2D}
   */
  #ctx;
  /**
   * Creates a Simple2D object, gets the context
   * for the `<canvas>` element, and prepares for animations on it.
   * @param {HTMLCanvasElement} element
   */
  constructor(element) {
    this.#elm = element;
    this.#ctx = element.getContext('2d');
    this.#onResize(0.8, 0.8);
    window.addEventListener('resize', () => this.#onResize(0.8, 0.8));
  }
  /**
   * Adjusts the `<canvas>` element and its context
   * as the browser's window resizes.
   * @param {number} scaleX
   * @param {number} scaleY
   */
  #onResize(scaleX, scaleY) {
    this.#elm.width = scaleX * window.innerWidth;
    this.#elm.height = scaleY * window.innerHeight;
    const simplifier = simplifyGrid(this.#elm.width, this.#elm.height);
    this.#ctx.setTransform(simplifier);
  }
  /**
   * Callback used to draw frames.
   * @typedef {function(CanvasRenderingContext2D, DOMHighResTimeStamp):
   *     boolean} Draw
   */
  /**
   * Draws a frame of an animation and returns a boolean
   * indicating whether the animation continues.
   * @param {Draw} draw
   * @param {DOMHighResTimeStamp} timestamp
   * @return {boolean}
   */
  #frame(draw, timestamp) {
    if (timestamp === null) {
      return true;
    }
    return draw(this.#ctx, timestamp);
  }
  /**
   * Starts an animation loop.
   * @param {Draw} draw
   */
  #loop(draw) {
    (new Frame()).p
        .then((timestamp) => {
          if (this.#frame(draw, timestamp)) {
            this.#loop(draw);
          }
        })
        .catch((e) => console.warn(`${Simple2D.MESSAGE_CATCH}: ${e}.`));
  }
  /**
   * The message shown when an error is thrown.
   * @type {string}
   */
  static MESSAGE_CATCH = '[Simple2D.#frame()] Caught an exception. ' +
      'It still works fine, but this is an unexpected behavior.';
  /**
   * Starts an animation.
   * @param {Draw} draw
   */
  animate(draw) {
    this.#loop(draw);
  }
}

// Exports values.
export {Frame, Simple2D};
