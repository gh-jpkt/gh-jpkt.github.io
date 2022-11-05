const styleElement = document.querySelector('#style-page-size');
const inputFile = document.querySelector('#input-file');
const selectElement = document.querySelector('#select-paper-direction');
const sectionImgs = document.querySelector('#section-imgs');
const tcContainer = document.querySelector('#template-container').content;
const tcImgContainer = document.querySelector('#template-img-container').content;

let classesMain = document.querySelector('main').classList;
const PAGE_DIRECTIONS = ['portrait', 'landscape'];

const updatePage = () => {
  //Set the page size.
  styleElement.textContent =
    '@page { size: A4 ' + PAGE_DIRECTIONS[selectElement.selectedIndex] + '; }';
  //Fallback for environments which doesn't support size descriptor.
  classesMain.remove('a4-portrait');
  classesMain.remove('a4-landscape');
  classesMain.add('a4-' + PAGE_DIRECTIONS[selectElement.selectedIndex]);

  //Create a new container.
  let newContainer = tcContainer.cloneNode(true);
  for (let file of inputFile.files) {
    let newImgContainer = tcImgContainer.cloneNode(true);
    newImgContainer.querySelector('img').src = URL.createObjectURL(file);
    newContainer.querySelector('div').appendChild(newImgContainer);
  }

  //Replace the old container.
  sectionImgs.querySelector('div').replaceWith(newContainer);
}

//Call updatePage() for initialization.
updatePage();

//Add event listeners
selectElement.addEventListener('change', updatePage);
inputFile.addEventListener('change', updatePage);
