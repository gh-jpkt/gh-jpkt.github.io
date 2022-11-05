let main = document.querySelector('main');
let inputFile = document.querySelector('#input-file');
let selPD = document.querySelector('#paper-direction');
let sectionImgs = document.querySelector('#section-imgs');
let tcContainer = document.querySelector('#template-container').content;
let tcImg = document.querySelector('#template-img').content;

let updatePage = () => {
  //Set the page size.
  if (selPD.selectedIndex == 0) {
    main.className = 'a4-paper-vertical';
  }
  else {
    main.className = 'a4-paper-horizontal';
  }
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

inputFile.addEventListener('change', updatePage);
selPD.addEventListener('change', updatePage);
