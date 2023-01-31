/**
 * date-created: 2023-01-31
 * date-last-updated: 2023-01-31
 * author: gh-jpkt
 * title: 2023-01-31-tile-images.js
 * digest: JavaScript file for `2023-01-31-tile-images.liquid.html`
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
   * Static private properties
   */
  /**
   * @type {HTMLTemplateElement}
   */
  static #templateTile;

  /***
   * Static initialization blocks
   */
  static {
    TilePage.#templateTile = document.querySelector("#tpl-tile");
    assert(TilePage.#templateTile, () => {
      console.error("Failed to get the <template> element for tile.");
    });
  }

  /***
   * Private instance properties
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
    newElement.className = `page ${size}-${direction} tile-${nColumns}`;
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
 * Create a TilePage object and add corresponding event listeners.
 */
const eTilePage = document.querySelector(".page");
assert(eTilePage, () => {
  console.error("Failed to get the HTML element for the tile page.");
});
const tilePage = new TilePage(eTilePage);
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
