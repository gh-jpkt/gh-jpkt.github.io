const styleElement = document.querySelector('#style-page-size');
const inputFile = document.querySelector('#input-file');
const selectElement = document.querySelector('#select-paper-direction');
const sectionImgs = document.querySelector('#section-imgs');
const tcContainer = document.querySelector('#template-container').content;
const tcImgBox = document.querySelector('#template-img-box').content;

const PAGE_DIRECTIONS = ['portrait', 'landscape'];

const updatePage = () => {
  //Create a new container.
  let newContainer = tcContainer.cloneNode(true);
  for (let file of inputFile.files) {
    let newImgBox = tcImgBox.cloneNode(true);
    newImgBox.querySelector('img').src = URL.createObjectURL(file);
    newContainer.querySelector('div').appendChild(newImgBox);
  }

  //Replace the old container.
  sectionImgs.querySelector('div').replaceWith(newContainer);

  //Set the page size.
  styleElement.textContent =
    '@page { size: A4 ' + PAGE_DIRECTIONS[selectElement.selectedIndex] + '; }';
  //Fallback for environments which doesn't support size descriptor.
  sectionImgs.querySelector('div').classList.add(
    'a4-' + PAGE_DIRECTIONS[selectElement.selectedIndex]
  );
}

//Call updatePage() for initialization.
//updatePage();

//Add event listeners
//selectElement.addEventListener('change', updatePage);
inputFile.addEventListener('change', updatePage);
