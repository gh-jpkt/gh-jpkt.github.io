/**
 * @author gh-jpkt
 * @file JavaScript module that contains Promise-based wrapper classes
 *     for the Web API's functionalities concerning timed operations.
 * @summary Contains Promise-based wrapper classes
 *     for the Web API's functionalities concerning timed operations.
 */
/* **
 * # timing.mjs
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
/**
 * The name of fields `finished` comes from the `Animation.finished` field
 * of the Web Animation API.
 */
/**
 * TODO: Find a way to make static fields read-only.
 */

/**
 * `reject` function accessed from executor functions
 * of the `Promise()` constructor.
 * @typedef {function(*): *} RejectFunction
 */

/**
 * Represents a Promise-based timer.
 */
class Timer {
  /**
   * Contains the messages passed to `resolve` or `reject`.
   * @type {{EXPIRATION: string, CANCELLATION: string}}
   */
  static MESSAGE = {
    EXPIRATION: 'Timing.Timer: The timer has expired.',
    CANCELLATION: 'Timing.Timer: The timer was canceled.',
  };

  /**
   * Creates a Timer object.
   * @param {number} delay - The duration of the delay in milliseconds.
   */
  constructor(delay) {
    this.finished = new Promise((resolve, reject) => {
      this.#promiseReject = reject;
      this.#timeoutID = setTimeout(resolve, delay, Timer.MESSAGE.EXPIRATION);
    });
  }

  /**
   * A promise that resolves when the timer expires
   * and is rejected when the timer is canceled.
   * In both cases, `resolve` or `reject` receives
   * the appropriate message chosen from `Timer.MESSAGE`.
   * @type {Promise}
   */
  finished;

  /**
   * Cancel the timer.
   */
  cancel() {
    clearTimeout(this.#timeoutID);
    this.#promiseReject(Timer.MESSAGE.CANCELLATION);
  }

  /**
   * A reference to the `reject` function.
   * The `Timer.cancel()` method uses this reference
   * to get the `Timer.finished` promise rejected.
   * @type {RejectFunction}
   */
  #promiseReject;
  /**
   * The timeout ID returned by the `setTimeout()` method.
   * @type {number}
   */
  #timeoutID;
}

/**
 * Represents a repaint task.
 */
class Repaint {
  /**
   * Contains the message passed to `reject`.
   * @type {{CANCELLATION: string}}
   */
  static MESSAGE = {
    CANCELLATION: 'Timing.Repaint: The repaint task was canceled.',
  };

  /**
   * Callback of a repaint task that is passed the timestamp of its initiation.
   * @typedef {function(DOMHighResTimeStamp): *} RepaintCallback
   */
  /**
   * Register a repaint task to the browser.
   * @param {RepaintCallback} task - Callback of a repaint task.
   */
  constructor(task) {
    this.finished = new Promise((resolve, reject) => {
      this.#promiseReject = reject;
      this.#requestID = window.requestAnimationFrame(
          (timestamp) => resolve(task(timestamp)));
    });
  }

  /**
   * A promise that resolves with the return value of the given callback
   * and is rejected with the cancellation message
   * when the repaint task was canceled.
   * @type {Promise}
   */
  finished;

  /**
   * Cancel the repaint task.
   */
  cancel() {
    window.cancelAnimationFrame(this.#requestID);
    this.#promiseReject(Repaint.MESSAGE.CANCELLATION);
  }

  /**
   * A reference to the `reject` function.
   * The `Repaint.cancel()` method uses this reference
   * to get the `Repaint.finished` promise rejected.
   * @type {RejectFunction}
   */
  #promiseReject;
  /**
   * The request ID returned by the `window.requestAnimationFrame()` method.
   * @type {number}
   */
  #requestID;
}

// Export the modules.
export {Timer, Repaint};
