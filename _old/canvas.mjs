/**
 * @author gh-jpkt
 * @file JavaScript module that contains functionalities for the Canvas API.
 * @summary Contains functionalities for the Canvas API.
 */
/* **
 * # canvas.mjs
 *
 * ```yaml
 * --metadata-ctm:
 *   created: 2023-02-09
 *   last-updated: 2023-02-09
 *   author:
 *   title:
 *   digest:
 * ```
 */

// Import modules.
// import * as Timing from 'modules/timing.mjs';
/* **
 * DEV: The following line is only for IntelliSense.
 * TODO: Delete it if it's no longer needed.
 */
import * as Timing from './timing.mjs';

/**
 * Callback used to draw a frame of an 2D animation
 * that is passed the 2D rendering context and the timestamp of the frame
 * and returns the boolean indicating whether the animation continues.
 * @typedef {function(CanvasRenderingContext2D,
 *     DOMHighResTimeStamp): boolean} FrameDrawer2D
 */

/**
 * Represents a 2D canvas.
 *
 * This canvas following features:
 * - Involves frame-based animations.
 * - Automatically fits into the parent element.
 * - The origin of a canvas is located at the center of the canvas.
 * - You can set a timeout for each frame of animations.
 */
class Canvas2D {
  /**
   * Creates a Canvas2D object for the specified parent element.
   *
   * The `#elementWrapper` element must contain a `<canvas>` element as a child.
   * @param {HTMLElement} elementWrapper - The parent element of
   *     the `<canvas>` element.
   */
  constructor(elementWrapper) {
    this.#elementWrapper = elementWrapper;
    this.#elementCanvas = elementWrapper.querySelector('canvas');
    this.#ctx = this.#elementCanvas.getContext('2d');
  }

  /**
   * Starts a frame-based animation.
   * @param {FrameDrawer2D} drawFrame - The callback used to draw a frame.
   * @param {DOMHighResTimeStamp} timeout - The duration of the timeout
   *     for the callback in milliseconds.
   */
  animate(drawFrame, timeout = Number.MAX_SAFE_INTEGER) {
    this.#repaint(drawFrame, timeout);
  }

  /**
   * Contains the message for the timeout.
   * @type {{TIMEOUT: string}}
   */
  static MESSAGE = {
    TIMEOUT: 'Canvas.Canvas2D: The animation was canceled ' +
        'because the timeout has expired.',
  };

  /**
   * Resizes the `<canvas>` element to fit it into
   * the `#elementWrapper` element.
   */
  #autoResize() {
    /**
     * DEV: Auto-resizing doesn't work correctly, so the size of canvases is
     *     fixed for now.
     * TODO: Find a solution for this problem.
     */
    /* **
    this.#elementCanvas.width = this.#elementWrapper.offsetWidth;
    this.#elementCanvas.height = this.#elementWrapper.offsetHeight;
    */
    this.#elementCanvas.width = 0.9 * window.innerWidth;
    this.#elementCanvas.height = 0.9 * window.innerHeight;
  }
  /**
   * Reset the transformation of the context.
   * As a result, the range of <var>x</var>-coordinate and
   * <var>y</var>-coordinate will be [-1, 1].
   */
  #resetTransform() {
    this.#ctx.setTransform(
        this.#elementCanvas.width / 2, 0, 0, this.#elementCanvas.height / 2,
        this.#elementCanvas.width / 2, this.#elementCanvas.height / 2,
    );
  }
  /**
   * Repaints the canvas and continues the animation
   * if the `drawFrame` callback returns `true`
   * (or a value evaluated to 'true').
   * @param {FrameDrawer2D} drawFrame - The callback used to draw a frame.
   * @param {DOMHighResTimeStamp} timeout - The duration of the timeout
   *     for the callback in milliseconds.
   */
  #repaint(drawFrame, timeout = Number.MAX_SAFE_INTEGER) {
    // Create objects.
    const frame = new Timing.Repaint((timestamp) => {
      this.#autoResize();
      this.#resetTransform();
      return drawFrame(this.#ctx, timestamp);
    });
    const timer = new Timing.Timer(timeout);

    // Attach handlers to the `finished` fields.
    /* **
     * DEV: Added some console outputs.
     * TODO: Delete them later.
     */
    frame.finished.then((continues) => {
      timer.cancel();
      if (continues) {
        this.#repaint(drawFrame, timeout);
      }
    }).catch((msg) => {console.info(`(FC) ${msg}`);});
    timer.finished.then(() => {
      frame.cancel();
      console.info(Canvas2D.MESSAGE.TIMEOUT);
    }).catch((msg) => {console.info(`(TC) ${msg}`);});
  }

  /**
   * The parent element of the `<canvas>` element.
   * @type {HTMLElement}
   */
  #elementWrapper;
  /**
   * The `<canvas>` element.
   * @type {HTMLCanvasElement}
   */
  #elementCanvas;
  /**
   * The 2D rendering context for the `<canvas>` element.
   * @type {CanvasRenderingContext2D}
   */
  #ctx;
}

// Export the modules.
export {Canvas2D};
