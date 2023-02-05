---
title: Note on using promises
date: 2023-02-12
categories: note
---

Updated: <time>2023-02-12</time>

## Using Promises

Always attach a rejection handler to a promise that may be rejected, because if not handled, this results in an `unhandledrejection` event (cf. [Promise.prototype.catch() \| MDN][mdn--unhandled-rejection]).

When wrapping old asynchronous APIs using Promises, design those wrappers so that callbacks are **attached** to a promise rather than **passed** to it. The point of using Promises is reduce nested callbacks to flat Promise chains, so there's no point using Promises with nested callbacks.

An easy approach to achieve this is to just pass `resolve` or `reject` function as a callback parameter to old APIs.

> The best practice is to wrap the callback-accepting functions at the lowest possible level, and then never call them directly again

(by [<cite>MDN</cite>][mdn--wrapping-old-api])

I'll show an example of a good wrapper and 2 bad wrappers below:

``` js
/** @typedef {function(DOMHighResTimeStamp): boolean} Callback */

/**
 * @return {Promise}
 */
const newFrameGood = () => new Promise((resolve) =>
  window.requestAnimationFrame(resolve));

/**
 * @param {Callback} callback
 * @return {Promise}
 */
const newFrameBad1 = (callback) => new Promise((resolve) =>
  window.requestAnimationFrame((time) => resolve(callback(time))));

/**
 * @param {Callback} callback
 * @return {Promise}
 */
const newFrameBad2 = (callback) => new Promise((resolve, reject) =>
  window.requestAnimationFrame((time) => {
    try {
      resolve(callback(time));
    } catch (e) {
      reject(e);
    }
  }));

/**
 * @param {Callback} callback
 */
const animateGood = (callback) => {
  newFrameGood()
      .then((time) => {
        if (callback(time)) {
          animateGood(callback);
        }
      })
      .catch((e) => console.warn(`[animateGood()] Caught an error: ${e}`));
};

/**
 * @param {Callback} callback
 * @param {function(Callback): Promise} newFrame
 */
const animateBad = (callback, newFrame) => {
  newFrame(callback)
      .then((continues) => {
        if (continues) {
          animateBad(callback, newFrame);
        }
      })
      .catch((e) => console.warn(`[animateBad()] Caught an error: ${e}`));
};

/**
 * Simulate actual draw operations.
 * @param {DOMHighResTimeStamp} time
 * @return {boolean}
 */
const drawFrame = (time) => {
  const r = Math.random();
  if (r <= 0.2) {
    throw Error('[drawFrame()] Failed to complete operations.');
  } else if (r <= 0.4) {
    console.info('[drawFrame()] Finishes the animation.');
    return false;
  }
  console.info('[drawFrame()] Continues the animation ...');
  return true;
};

// Try executing one of the following.
// animateGood(drawFrame);
// animateBad(drawFrame, newFrameBad1);
// animateBad(drawFrame, newFrameBad2);
```

In addition to reducing nested callbacks, the `newFrameGood()` method has following advantages:

+ The flow of execution becomes simpler. Calling `newFrameGood()` means just "Wait for the next repaint" rather than "Wait for the next repaint and do the specified operations".
+ The flow inside the wrapper also becomes simple because it calls `resolve` or `reject` (which means going outside the wrapper) where the callbacks are. We don't have to take care of the results of those callbacks because they are up to attached code to `then()` or `catch()`.
+ On the other hand, we have to do so in the bad examples, or you may make careless mistakes. An example of this is `newFrameBad1()`. Errors thrown inside `callback` aren't caught by `catch()`. This is because those errors are actually not thrown inside the executor function of `Promise()`. `callback` is registered to the browser's internal callback list, whose entries are called outside the executor. So we need to catch errors in `callback` and invoke `reject`, which results in a complex flow of execution.

(cf. [Using promises \| MDN][mdn--using-promises])

<!-- References -->
[mdn--unhandled-rejection]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch#description
[mdn--wrapping-old-api]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises#creating_a_promise_around_an_old_callback_api
[mdn--using-promises]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises
