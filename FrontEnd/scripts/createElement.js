
export const errorMessage = document.createElement('p');
errorMessage.classList.add('error-message');
errorMessage.setAttribute('style', 'display: none');

export const galleryModalFooter = document.createElement('div');
galleryModalFooter.classList.add('modal-footer');

export const addBtn = document.createElement('button');
addBtn.classList.add('btn-add');
addBtn.innerText = 'Ajouter une photo';

export const addPictureWrapper = document.createElement('div');
addPictureWrapper.classList.add('picture-add-content');

export const pictureIcon = document.createElement('i');
pictureIcon.classList.add('far', 'fa-image', 'icon-picture');

export const btnAddPicture = document.createElement('input');
btnAddPicture.setAttribute('type', 'file');
btnAddPicture.setAttribute('accept', 'image/png, image/jpg');
btnAddPicture.setAttribute('style', 'display: none');
btnAddPicture.id = 'fileInput';

export const labelBtnFile = document.createElement('label');
labelBtnFile.setAttribute('for', 'fileInput');
labelBtnFile.classList.add('btn-add-picture');
labelBtnFile.innerText = '+ Ajouter photo';

export const pictureInstructionText = document.createElement('p');
pictureInstructionText.classList.add('txt-wrapper-picture');
pictureInstructionText.innerText = 'jpg, png : 4mo max';

export const formAddNewPicture = document.createElement('div');
formAddNewPicture.classList.add('form-send-picture');

export const labelTitleAdd = document.createElement('label');
labelTitleAdd.classList.add('label-title');
labelTitleAdd.textContent = 'Titre';

export const formAddTitle = document.createElement('input');
formAddTitle.classList.add('title-add-picture');
formAddTitle.setAttribute('type', 'text');
formAddTitle.setAttribute('id', 'form-title');

export const labelTitleCat = document.createElement('label');
labelTitleCat.classList.add('label-title');
labelTitleCat.textContent = 'Catégorie';

export const selectCat = document.createElement('select');
selectCat.classList.add('btn-select-cat');

export const formCat = document.createElement('div');
formCat.classList.add('form-select-cat');

export const btnAddNewPicture = document.createElement('input');
btnAddNewPicture.classList.add('btn-send-picture');
btnAddNewPicture.setAttribute('type', 'submit');
btnAddNewPicture.value= 'Valider';

export const addPictureModalFooter = document.createElement('div');
addPictureModalFooter.classList.add('modal-footer2');