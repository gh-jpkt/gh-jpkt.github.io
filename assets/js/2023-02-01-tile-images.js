/**
 * date-created: 2023-02-01
 * date-last-updated: 2023-02-07
 * author: gh-jpkt
 * title: 2023-02-01-tile-images.js
 * digest: JavaScript file for `2023-02-01-tile-images.liquid.html`
 */

"use strict";

/**
 * Assertion function
 * @param {boolean} expression - Expression to be evaluated
 * @param {function(): *} onFail - Callback to be called when this assertion fails
 */
function assert(expression, onFail) {
  if (!expression) {
    onFail();
  }
}

/** Class representing a tile page */
class TilePage {
  /***
   * Static initialization blocks
   * 
   * NOTE: [Static initialization blocks isn't supported on many mobile browsers as of 2023-02-02][https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Static_initialization_blocks], so a fallback (using `TilePage.init()` method) is used for now.
   */
  /***

  static {
    this.#templateTile = document.querySelector("#tpl-tile");
    assert(this.#templateTile, () => {
      console.error("Failed to get the <template> element for tile.");
    });
  }

   */

  /***
   * Public static methods
   */
  /**
   * Initialize static fields of TilePage
   */
  static init() {
    this.#templateTile = document.querySelector("#tpl-tile");
    assert(this.#templateTile, () => {
      console.error("Failed to get the <template> element for tile.");
    });
  }

  /***
   * Public instance methods
   */
  /**
   * Create a tile page
   * @param {HTMLElement} element - HTML element for this tile page
   */
  constructor(element) {
    this.#element = element;
    this.#imageURLs = [];
  }
  /**
   * Update the tiled images
   * @param {string} size - Size (Only "a4")
   * @param {string} direction - Direction (Either of "portrait" or "landscape")
   * @param {number} nColumns - Number of columns (Either of 2, 3, or 4)
   * @param {FileList} fileList - FileList object containing new images
   */
  updateImages(size, direction, nColumns, fileList) {
    this.#releaseImages();
    this.#recreateElement(size, direction, nColumns);
    for (const file of fileList) {
      this.#addTile(file);
    }
  }

  /***
   * Static private fields
   */
  /**
   * @type {HTMLTemplateElement}
   */
  static #templateTile;

  /***
   * Private instance fields
   */
  /**
   * @type {HTMLElement}
   */
  #element;
  /**
   * @type {Array<string>}
   */
  #imageURLs;

  /***
   * Private instance methods
   */
  /**
   * Release the existing object URLs and remove them from #imageURLs
   */
  #releaseImages() {
    for (const url of this.#imageURLs) {
      URL.revokeObjectURL(url);
    }
    this.#imageURLs = [];
  }
  /**
   * Recreate the tile page element
   * @param {string} size - Size (Only "a4")
   * @param {string} direction - Direction (Either of "portrait" or "landscape")
   * @param {number} nColumns - Number of columns (Either of 2, 3, or 4)
   */
  #recreateElement(size, direction, nColumns) {
    const newElement = document.createElement("div");
    newElement.className = `page ${size}-${direction} tile-page-${nColumns}`;
    this.#element.replaceWith(newElement);
    this.#element = newElement;
  }
  /**
   * Add a tile with the specified image
   * @param {File} file - File representing an image
   */
  #addTile(file) {
    const objectURL = URL.createObjectURL(file);
    this.#imageURLs.push(objectURL);
    const tile = TilePage.#templateTile.content.cloneNode(true);
    const img = tile.querySelector("img");
    img.src = objectURL;
    this.#element.appendChild(tile);
  }
}

/***
 * Manipulate the DOM.
 */
/***
 * Create a TilePage object.
 */
TilePage.init();
const eTilePage = document.querySelector(".page");
assert(eTilePage, () => {
  console.error("Failed to get the HTML element for the tile page.");
});
const tilePage = new TilePage(eTilePage);

/***
 * Add event listeners.
 */
for (const elm of document.querySelectorAll("select")) {
  elm.addEventListener("change", updateTilePage);
}
for (const elm of document.querySelectorAll('input[type="file"]')) {
  elm.addEventListener("change", updateTilePage);
}

/**
 * Update the tile page
 */
function updateTilePage() {
  const size = document.querySelector("#slc-size").selectedOptions[0].value;
  const direction = document.querySelector("#slc-dir").selectedOptions[0].value;
  const nColumns = document.querySelector("#slc-cols").selectedOptions[0].value;
  const files = document.querySelector("#file-images").files;
  tilePage.updateImages(size, direction, nColumns, files);
}
