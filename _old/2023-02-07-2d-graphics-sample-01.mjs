/**
 * @author gh-jpkt
 * @file JavaScript file for `2023-02-07-2d-graphics-sample-01.liquid.html`.
 * @summary Demonstrates an simple animation on a 2D canvas.
 *
 * # 2023-02-07-2d-graphics-sample-01.mjs
 *
 * ```yaml
 * --metadata-ctm:
 *   created: 2023-02-07
 *   last-updated: 2023-02-09
 *   author:
 *   title:
 *   digest:
 * ```
*/

// DEV: These code are just for the note and temporary.
/**
 * @return {Promise}
 */
const newFrameGood = () => new Promise((resolve) =>
  window.requestAnimationFrame(resolve));
/**
 * @param {function(DOMHighResTimeStamp): boolean} callback
 */
const animateGood = (callback) => {
  newFrameGood().then((time) => {
    if (callback(time)) {
      animateGood(callback);
    }
  }).catch((e) => console.error(`[animate()] Caught an error: ${e}`));
};

/**
 * @param {function(DOMHighResTimeStamp): boolean} callback
 * @return {Promise}
 */
const newFrameBad = (callback) => new Promise((resolve) =>
  window.requestAnimationFrame((time) => resolve(callback(time))));
/**
 * @param {function(DOMHighResTimeStamp): boolean} callback
 */
const animateBad = (callback) => {
  newFrameBad(callback).then((continues) => {
    if (continues) {
      animateBad(callback);
    }
  }).catch((e) => console.error(`[animate()] Caught an error: ${e}`));
};

// Using these functions.
/**
 * Simulate actual draw operations.
 * @param {DOMHighResTimeStamp} time
 * @returns boolean
 */
const drawFrame = (time) => {
  const r = Math.random();
  if (r <= 0.1) {
    throw Error('[drawFrame()] Failed to complete operations.');
  }
  else if (r <= 0.3) {
    console.info('[drawFrame()] Finishes the animation.');
    return false;
  }
  console.info('[drawFrame()] Continues the animation ...');
  return true;
};

animateGood(drawFrame);
animateBad(drawFrame);
// DEV: The end of temporary code.

// Import modules.
// import * as Canvas from 'modules/canvas.mjs';
/* **
 * DEV: The following line is only for IntelliSense.
 * TODO: Delete it if it's no longer needed.
 */
import * as Canvas from './canvas.mjs';

/**
 * @type {HTMLElement}
 */
const wrapper = document.querySelector('#wrapper');
/**
 * @type {Canvas.Canvas2D}
 */
const canvas = new Canvas.Canvas2D(wrapper);
/**
 * @type {Canvas.FrameDrawer2D}
 * @param {CanvasRenderingContext2D} ctx
 * @param {DOMHighResTimeStamp} timestamp
 * @return {boolean}
 */
const drawFrame = (ctx, timestamp) => {
  ctx.fillStyle = `rgb(0, ${255 * Math.random()}, 0)`;
  ctx.fillRect(0, 0, 0.5, 0.2);

  // DEV: Begin.
  for (let i = 0; i < 100000; i++) {
    console.log(i);
  }
  return true;
  // DEV: End.
};
/**
 * @type {number}
 */
const TIMEOUT_FRAME = 10;
// canvas.animate(drawFrame, TIMEOUT_FRAME);

/**
 * A good wrapper for `window.requestAnimationFrame()`.
 * @return {Promise}
 */
const goodWrapper = () => new Promise((resolve) =>
  window.requestAnimationFrame(resolve));

/**
* The first bad wrapper for `window.requestAnimationFrame()`.
* @param {function(DOMHighResTimeStamp): *} drawCallback
* @return {Promise}
*/
const badWrapper1 = (drawCallback) => new Promise((resolve) => {
  window.requestAnimationFrame((timestamp) => resolve(drawCallback(timestamp)));
});

/**
* The second bad wrapper for `window.requestAnimationFrame()`.
* @param {function(DOMHighResTimeStamp): *} drawCallback
* @return {Promise}
*/
const badWrapper2 = (drawCallback) => new Promise((resolve, reject) => {
  window.requestAnimationFrame((timestamp) => {
    try {
      resolve(drawCallback(timestamp));
    } catch (e) {
      reject(e);
    }
  });
});

/**
 * Draws something and returns the result.
 * @param {DOMHighResTimeStamp} timestamp
 * @return {string}
 */
const drawSomething = (timestamp) => {
  if (Math.random() < 0.5) {
    throw Error(`Failed to draw ... (started at ${timestamp})`);
  }
  return `Drew successfully! (started at ${timestamp})`;
};

/**
 * Does something after the success of the draw operation.
 * @param {string} result
 */
const afterSuccess = (result) => {
  console.log(`The draw operation succeeded with (${result})`);
};

/**
 * Does something after the failure of the draw operation.
 * @param {Error} e
 */
const afterFailure = (e) => {
  console.log(`The draw operation failed with (${e})`);
};

// Using these wrappers.
goodWrapper().then(drawSomething).then(afterSuccess).catch(afterFailure);
badWrapper1(drawSomething).then(afterSuccess).catch(afterFailure);
badWrapper2(drawSomething).then(afterSuccess).catch(afterFailure);
