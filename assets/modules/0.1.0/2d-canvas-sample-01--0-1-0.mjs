/**
 * @author gh-jpkt
 * @file 2D canvas sample 01.
 * @summary Demonstrates an simple animation on a 2D canvas.
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

// Imports modules.
import * as Canvas from './canvas.mjs';

/**
 * Represents a (x, y) coordinate.
 * @typedef {{x: number, y: number}} Coordinate
 */

/**
 * Represents a diagonal wave on a board that consists of cells.
 */
class Wave {
  /**
   * The coordinate of the bottom-right of the board.
   * Note that it's not same as the size of the board.
   * @type {Coordinate}
   */
  #bottomRight;
  /**
   * The source of the wave.
   * @type {Coordinate}
   */
  #source;
  /**
   * The current phase of the wave.
   * @type {number}
   */
  phase;
  /**
   * The last phase of the wave.
   * @type {number}
   */
  lastPhase;
  /**
   * Creates a Wave object.
   * @param {Coordinate} board
   * @param {Coordinate} source
   */
  constructor(board, source) {
    this.#bottomRight = {x: board.x - 1, y: board.y - 1};
    this.#source = source;
    this.phase = 0;
    this.lastPhase =
        Math.max(this.#source.x, this.#bottomRight.x - this.#source.x) +
        Math.max(this.#source.y, this.#bottomRight.y - this.#source.y);
  }
  /**
   * Advances the wave and returns a boolean indicating
   * whether any part of the wave is inside the board.
   */
  advance() {
    this.phase++;
  }
  /**
   * Invokes the given callback for each point on the wave.
   * @param {function(Coordinate): *} callback
   */
  forEach(callback) {
    // Calculates the end points.
    const LEFT_END = this.#source.x - this.phase;
    const RIGHT_END = this.#source.x + this.phase;
    const TOP_END = this.#source.y - this.phase;
    const BOTTOM_END = this.#source.y + this.phase;
    const LEFT_OVERFLOW = Math.min(LEFT_END - 0, 0);
    const RIGHT_OVERFLOW = Math.max(RIGHT_END - this.#bottomRight.x, 0);
    const TOP_OVERFLOW = Math.min(TOP_END - 0, 0);
    const BOTTOM_OVERFLOW = Math.max(BOTTOM_END - this.#bottomRight.y, 0);
    // Left to top.
    let pos = {x: LEFT_END - LEFT_OVERFLOW, y: this.#source.y + LEFT_OVERFLOW};
    for (; pos.y >= TOP_END - TOP_OVERFLOW; pos.x++, pos.y--) {
      callback(pos);
    }
    // Left to bottom.
    pos = {x: LEFT_END - LEFT_OVERFLOW, y: this.#source.y - LEFT_OVERFLOW};
    for (; pos.y <= BOTTOM_END - BOTTOM_OVERFLOW; pos.x++, pos.y++) {
      callback(pos);
    }
    // Right to top.
    pos = {x: RIGHT_END - RIGHT_OVERFLOW, y: this.#source.y - RIGHT_OVERFLOW};
    for (; pos.y >= TOP_END - TOP_OVERFLOW; pos.x--, pos.y--) {
      callback(pos);
    }
    // Right to bottom.
    pos = {x: RIGHT_END - RIGHT_OVERFLOW, y: this.#source.y + RIGHT_OVERFLOW};
    for (; pos.y <= BOTTOM_END - BOTTOM_OVERFLOW; pos.x--, pos.y++) {
      callback(pos);
    }
  }
}

/**
 * Represents a color using the HSL cylindrical-coordinate system.
 * @typedef {{h: number, s: number, l: number, a: number}} HSLColor
 */

/**
 * Represents a gradient using two HSLColor objects.
 * @typedef {{start: HSLColor, end: HSLColor}} Gradient
 */

/**
 * Gets a color on the gradient line.
 * @param {Gradient} gradient
 * @param {number} degree
 * @return {HSLColor}
 */
const gradientColor = (gradient, degree) => ({
  h: gradient.start.h + degree * (gradient.end.h - gradient.start.h),
  s: gradient.start.s + degree * (gradient.end.s - gradient.start.s),
  l: gradient.start.l + degree * (gradient.end.l - gradient.start.l),
  a: gradient.start.a + degree * (gradient.end.a - gradient.start.a),
});

/**
 * Generates a string for `fillStyle` from the specified HSLColor object.
 * @param {HSLColor} hsl
 * @return {string}
 */
const fillStyleFromHSL = (hsl) =>
  `hsl(${hsl.h}deg ${hsl.s}% ${hsl.l}% / ${hsl.a})`;

/**
 * Represents a colored wave.
 * @extends Wave
 */
class ColorWave extends Wave {
  /**
   * The gradient of the wave.
   * @type {Gradient}
   */
  grad;
  /**
   * Creates a ColorWave object.
   * @param {Coordinate} board
   * @param {Coordinate} source
   * @param {Gradient} grad
   */
  constructor(board, source, grad) {
    super(board, source);
    this.grad = grad;
  }
}

/**
 * Represents an array of ColorWave objects
 * with some additional functionalities.
 * @extends Array<ColorWave>
 */
class ColorWaves extends Array {
  /**
   * The size of the board.
   * @type {Coordinate}
   */
  #board;
  /**
   * Creates a ColorWaves object with an empty array.
   * @param {Coordinate} board
   */
  constructor(board) {
    super(0);
    this.#board = board;
  }
  /**
   * Adds a wave to the array.
   * @param {Coordinate} source
   * @param {Gradient} grad
   */
  add(source, grad) {
    this.push(new ColorWave(this.#board, source, grad));
  }
  /**
   * Advances all the waves in this array.
   */
  advanceWaves() {
    this.forEach((colorWave) => colorWave.advance());
  }
  /**
   * Removes waves that have gone outside the board.
   */
  removeGoneWaves() {
    this.filter((colorWave) => (colorWave.phase <= colorWave.lastPhase));
  }
}

/**
 * Returns a random number in [a, b).
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
const randomBetween = (a, b) => {
  return a + (b - a) * Math.random();
};

/**
 * Returns a random integer in [a, b).
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
const randomInteger = (a, b) => {
  return Math.round(randomBetween(a, b));
};

/**
 * Converts a coordinate on the board to that on the canvas context.
 * @param {Coordinate} pos
 * @param {Coordinate} board
 * @return {Coordinate}
 */
const boardToCanvas = (pos, board) => ({
  x: 2 * pos.x / board.x - 1,
  y: 2 * pos.y / board.y - 1,
});

/**
 * DEV-TEMP: Represents an FPS counter whose log is
 * displayed on a HTML element.
 */
class FPSCounter {
  /**
   * The HTML element that is used to log the FPS.
   * @type {HTMLElement}
   */
  #element;
  /**
   * The frequency at which the FPS counter logs.
   * @type {DOMHighResTimeStamp}
   */
  #frequency;
  /**
   * The timestamp of the last frame.
   * @type {DOMHighResTimeStamp}
   */
  #lastTimestamp;
  /**
   * The number of accumulated frames since the last update of the log.
   * @type {number}
   */
  #nAccumulatedFrames;
  /**
   * Creates an FPSCounter tied to the specified HTML element.
   * FPS is logged every `frequency` milliseconds.
   * @param {HTMLElementDeprecatedTagNameMap} element
   * @param {DOMHighResTimeStamp} frequency
   */
  constructor(element, frequency = 1000) {
    this.#element = element;
    this.#frequency = frequency;
    /* **
     * TODO: Is this initialization OK?
     * Read the reference and consider this.
     */
    this.#lastTimestamp = 0;
    this.#nAccumulatedFrames = 0;
  }
  /**
   * Logs the FPS.
   * @param {DOMHighResTimeStamp} timestamp
   */
  log(timestamp) {
    this.#nAccumulatedFrames++;
    if (timestamp - this.#lastTimestamp >= this.#frequency) {
      const fps = 1000 * this.#nAccumulatedFrames /
          (timestamp - this.#lastTimestamp);
      this.#element.textContent = fps;
      this.#lastTimestamp = timestamp;
      this.#nAccumulatedFrames = 0;
    }
  }
}

/**
 * Represents a wave board.
 */
class WaveBoard {
  /**
   * The size of the wave board.
   * @type {Coordinate}
   */
  #board;
  /**
   * Waves currently on the board.
   * @type {ColorWaves}
   */
  #colorWaves;
  /**
   * DEV-TEMP: A FPS counter.
   * @type {FPSCounter}
   */
  #fpsCounter;
  /**
   * Creates a WaveBoard object with the specified dimension of the board.
   * @param {Coordinate} board
   */
  constructor(board) {
    this.#board = board;
    this.#colorWaves = new ColorWaves(board);
    // DEV-TEMP: Initialize the FPS counter.
    this.#fpsCounter = new FPSCounter(document.querySelector('#fps-counter'));
  }
  /**
   * Draws a frame of the waving animation.
   * @param {CanvasRenderingContext2D} ctx
   * @param {DOMHighResTimeStamp} timestamp
   * @return {boolean}
   */
  drawFrame(ctx, timestamp) {
    // DEV-TEMP: Logs the FPS.
    this.#fpsCounter.log(timestamp);
    // Adds a wave randomly.
    if (Math.random() <= 0.01) {
      this.#colorWaves.add(
          {
            x: randomInteger(0, this.#board.x),
            y: randomInteger(0, this.#board.y),
          },
          {
            start: {
              h: 0.36 * timestamp, s: 100,
              l: 60, a: 0.8,
            },
            end: {
              h: 0.36 * (timestamp + 1000), s: 100,
              l: 40, a: 0.6,
            },
          },
      );
    }
    // Draws waves.
    this.#colorWaves.forEach((colorWave) => {
      colorWave.forEach((pos) => {
        ctx.fillStyle = fillStyleFromHSL(
            gradientColor(
                colorWave.grad,
                colorWave.phase / colorWave.lastPhase,
            ),
        );
        // Fills a rectangle.
        const posOnCanvas = boardToCanvas(pos, this.#board);
        ctx.fillRect(
            posOnCanvas.x, posOnCanvas.y,
            2 / this.#board.x, 2 / this.#board.y,
        );
      });
    });
    // Advances waves and removes waves that have gone out side the board..
    this.#colorWaves.advanceWaves();
    this.#colorWaves.removeGoneWaves();
    // Continues the animation.
    return true;
  }
}

// Uses the above classes.
/** @type {HTMLCanvasElement} */
const canvasElm = document.querySelector('#canvas');
const c2d = new Canvas.Simple2D(canvasElm);
const wb = new WaveBoard({x: 400, y: 400});
c2d.animate((ctx, timestamp) => wb.drawFrame(ctx, timestamp));
