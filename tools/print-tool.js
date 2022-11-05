let inputFile = document.querySelector('#input-file');
let sectionImgs = document.querySelector('#section-imgs');
let tcContainer = document.querySelector('#template-container').content;
let tcImg = document.querySelector('#template-img').content;

let onFileChange = () => {
  //Create a new container.
  let newContainer = tcContainer.cloneNode(true);
  for (let file of inputFile.files) {
    let newImg = tcImg.cloneNode(true);
    /*
    newImg.querySelector('img').src = URL.createObjectURL(file);
    newContainer.querySelector('div').appendChild(newImg);
     */
    newImg.querySelector('img').src = URL.createObjectURL(file);
    newContainer.querySelector('div').appendChild(newImg);
  }
  //Replace the old container.
  sectionImgs.querySelector('div').replaceWith(newContainer);
}

inputFile.addEventListener('change', onFileChange);
