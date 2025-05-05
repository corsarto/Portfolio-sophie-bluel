import { errorMessage, galleryModalFooter, addBtn, addPictureWrapper, 
    pictureIcon, btnAddPicture, labelBtnFile, pictureInstructionText,
    formAddNewPicture, labelTitleAdd,  formAddTitle, labelTitleCat,
    selectCat, formCat,  btnAddNewPicture, addPictureModalFooter } from './createElement.js';
import {fetchWorks } from './script.js';
let currentModal = null;
let urlAdmin = 'http://localhost:5678/api/';
let previouslyFocusedElement = null;

const galleryModalContent = document.getElementById('modal-content1');
const addPictureModalContent = document.getElementById('modal-content2');

galleryModalFooter.appendChild(addBtn);
galleryModalContent.appendChild(galleryModalFooter);

const addPictureContent = document.querySelector('.modal-content2');
const btnReturn = document.querySelector('.return-modal');

const iconCat = document.querySelector('.icon-form');

addPictureContent.appendChild(addPictureWrapper);
addPictureWrapper.appendChild(pictureIcon);
addPictureWrapper.appendChild(btnAddPicture);
addPictureWrapper.appendChild(labelBtnFile);
addPictureWrapper.appendChild(pictureInstructionText);
addPictureContent.appendChild(addPictureWrapper);
addPictureContent.appendChild(formAddNewPicture);
addPictureContent.appendChild(formCat);
addPictureModalContent.appendChild(addPictureModalFooter);
addPictureModalFooter.appendChild(btnAddNewPicture);
addPictureModalFooter.appendChild(errorMessage);
formAddNewPicture.appendChild(labelTitleAdd);
formAddNewPicture.appendChild(formAddTitle);
formAddNewPicture.appendChild(labelTitleCat);
formCat.appendChild(selectCat);
formCat.appendChild(iconCat);

const openModal = function (e) {
    e.preventDefault();
    previouslyFocusedElement = document.activeElement;

    currentModal = document.querySelector(e.target.getAttribute("href"));
    currentModal.style.display = null;
    currentModal.removeAttribute('aria-hidden');
    currentModal.setAttribute('aria-modal', 'true');

    galleryModalContent.setAttribute('style', 'display: flex');
    addPictureModalContent.setAttribute('style', 'display: none');

    currentModal.focus();

    const closeButtons = currentModal.querySelectorAll('.close-modal');
    closeButtons.forEach(btn => {
    btn.addEventListener('click', closeModal);
});
    currentModal.addEventListener('click', closeModal);
    currentModal.querySelector('.close-modal').addEventListener('click', closeModal);
    currentModal.querySelector('.modal-container').addEventListener('click', stopPropagation);
};

const closeModal = function (e) {
    if (currentModal === null)  return;
    e.preventDefault();
    const scrollPosition = window.scrollY;
    currentModal.blur();

    currentModal.style.display = "none";
    currentModal.setAttribute('aria-hidden', 'true');
    currentModal.removeAttribute('aria-modal');
    
    const closeButtons = currentModal.querySelectorAll('.close-modal');
    closeButtons.forEach(btn => {
    btn.removeEventListener('click', closeModal);
});
    currentModal.removeEventListener('click', closeModal);
    currentModal.querySelector('.close-modal').removeEventListener('click', closeModal);
    currentModal.querySelector('.modal-container').removeEventListener('click', stopPropagation);
    
    if (previouslyFocusedElement){ 
        previouslyFocusedElement.focus();}
    
    errorMessage.style.display = "none";
    errorMessage.textContent = "";
    currentModal = null;
    
    window.scrollTo(0, scrollPosition);
};

const stopPropagation = function (e) {
    e.stopPropagation();
};

document.querySelectorAll('.admin-portfolio-intro').forEach(a => {
    a.addEventListener('click', openModal);
});

window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
        closeModal(e);
    }
});

async function fetchWorksModalContent() {
    try {
        const response = await fetch( urlAdmin + 'works');
        if (!response.ok) {
            throw new Error("Erreur dans la récupération des projets pour la modale");
        }
        const projectsModal = await response.json(); 
        
        containerModal(projectsModal);  
    } catch (error) {
        console.error("Erreur : ", error);
    }
}

function containerModal(data) {
    
    const pictureGallery = document.querySelector('.modal-gallery');
    pictureGallery.innerHTML = '';
    
    for (let i = 0; i < data.length; i++) {
        const work = data[i];
        const figure = document.createElement("figure");
        figure.classList.add("image-wrapper");
        const img = document.createElement("img");

        img.src = work.imageUrl;
        img.alt = work.title;

        const trashIcon = document.createElement('i');
        trashIcon.classList.add('fas', 'fa-trash-can', 'icon-overlay');
        trashIcon.setAttribute('aria-hidden', 'false');
        trashIcon.dataset.id = work.id;

        trashIcon.addEventListener('click', deleteProject);

        figure.appendChild(img);
        figure.appendChild(trashIcon);
        pictureGallery.appendChild(figure);
        }}

function addProjectInGallery(projet) {
    const gallery = document.querySelector(".gallery"); 
    const figure = document.createElement("figure");
        
    const img = document.createElement("img");
    img.src = projet.imageUrl;
    img.alt = projet.title;
        
    const figcaption = document.createElement("figcaption");
    figcaption.textContent = projet.title;
        
    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
}

function addProjectInModal(projet) {
    const pictureGallery = document.querySelector('.modal-gallery');
    const figure = document.createElement("figure");
    figure.classList.add("image-wrapper");
        
    const img = document.createElement("img");
    img.src = projet.imageUrl;
    img.alt = projet.title;
        
    const trashIcon = document.createElement('i');
    trashIcon.classList.add('fas', 'fa-trash-can', 'icon-overlay');
    trashIcon.setAttribute('aria-hidden', 'false');
    trashIcon.dataset.id = projet.id;
        
    trashIcon.addEventListener('click', deleteProject);
        
    figure.appendChild(img);
    figure.appendChild(trashIcon);
    pictureGallery.appendChild(figure);
}

async function deleteProject(event) {
    const id = event.target.dataset.id;
    const token = localStorage.getItem("token");
    
    if (!token) {
        console.error("Token manquant, impossible de supprimer ce projet.");
        return;
    }
          if(!id) {
                console.log("L'id n'a pas été trouver, suppression annulée.");
                return;
            }
    
            const headers = {
                'Authorization': 'Bearer ' + token,
            };
    
            try{
                const resp = await fetch(urlAdmin + `works/${id}`,{
                    method: 'DELETE',
                    headers : headers,
                    body : null,
                });
    
                if(!resp.ok){
                    throw new Error("Erreur pendant la suppression du projet.");
                }
            
                    fetchWorks();
                    fetchWorksModalContent();
                   
                }catch(error) {
            console.log("Erreur : ", error);
    
          }}

async function fetchCategoriesModal() {
    try {
        const response = await fetch(urlAdmin + 'categories');
        if (!response.ok) {
            throw new Error("Erreur dans la récupération des catégories");
                }
        const categories = await response.json();

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.disabled = true;  
        defaultOption.selected = true;  
        defaultOption.textContent = '';
        selectCat.appendChild(defaultOption);
                    
        categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        selectCat.appendChild(option);
        });
        } catch (error) {
            console.error("Erreur : ", error);
        }
    }
fetchCategoriesModal();
       
function resetForm() {
    formAddTitle.value = '';
    selectCat.selectedIndex = 0;
            
    const oldPreviewImage = addPictureWrapper.querySelector('img');
    if (oldPreviewImage) {
        oldPreviewImage.remove();
    }

    pictureIcon.setAttribute('style', 'display: flex');
    labelBtnFile.setAttribute('style', 'display: flex');
    pictureInstructionText.setAttribute('style', 'display: flex');
}
            
addBtn.addEventListener('click', () => {

    galleryModalContent.setAttribute('style', 'display: none');
    addPictureModalContent.setAttribute('style', 'display: flex');

    resetForm();
    checkFormValidity();
});

btnReturn.addEventListener('click', () => {
    galleryModalContent.setAttribute('style', 'display: flex');
    addPictureModalContent.setAttribute('style', 'display: none');
    errorMessage.style.display = "none";
    errorMessage.textContent = "";

    resetForm();
    checkFormValidity();
});

const previewImg = document.getElementById('preview-img');

function validTypeFiles(file) {
const fileTypes = ['image/jpg', 'image/png'];
return fileTypes.includes(file.type);
}

function newImageAddDisplay (event) {
    event.preventDefault();
        
    const file = event.target.files[0];
    previewImg.innerHTML = '';

    const pictureIcone = document.querySelector('.icon-picture');
    const labelBtnFile = document.querySelector('label[for="fileInput"]');
    const txtAddPicture = document.querySelector('.txt-wrapper-picture');

    if (!file) {
        const textAddImg = document.createElement('p');
        textAddImg.textContent= "Aucune image sélectionnée.";
        previewImg.appendChild(textAddImg);
        pictureIcone.setAttribute('style', 'display: flex');
        labelBtnFile.setAttribute('style', 'display: flex');
        txtAddPicture.setAttribute('style', 'display: flex');
        return;
    }
        
    if(validTypeFiles(file)){
        const image = document.createElement('img');
        image.src = URL.createObjectURL(file);
        image.style.maxWidth = '420px';
        image.style.maxHeight = '169px';
        image.alt = 'Aperçu de l’image';

        addPictureWrapper.appendChild(image);

        pictureIcone.setAttribute('style', 'display: none');
        labelBtnFile.setAttribute('style', 'display: none');
        txtAddPicture.setAttribute('style', 'display: none');
    }
    else{
        const textNoneImg = document.createElement('p');
        textNoneImg.textContent= "Le format de l'image n'est pas supporter. Les formats accepter sont JPG et PNG.";
        addPictureWrapper.appendChild(textNoneImg);
        pictureIcone.setAttribute('style', 'display: flex');
        labelBtnFile.setAttribute('style', 'display: flex');
        txtAddPicture.setAttribute('style', 'display: flex');
}}
btnAddPicture.addEventListener('change', newImageAddDisplay);
      
async function sendNewPicture(event) {
    event.preventDefault();
    const token = localStorage.getItem("token");
    const idCat = selectCat.value;
    const title = formAddTitle.value;
    const file = btnAddPicture.files[0];

    if (!idCat || !title || !file) {
        errorMessage.textContent = "Veuillez remplir tous les champs.";
        errorMessage.style.display = "block";
        return;
    }
        
    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', title);
    formData.append('category', idCat);

    try {
        const response = await fetch(urlAdmin + 'works', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
            },
            body: formData,
        });

    if (!response.ok) {
        throw new Error("Erreur lors de l'ajout du projet.");
    }

    const newProject = await response.json();
    console.log("Projet ajouté avec succès", newProject);
    closeModal(event);
    addProjectInGallery(newProject);
    addProjectInModal(newProject);
    errorMessage.style.display = "none";
    errorMessage.textContent = "";
            
    } catch (error) {
        console.error("Erreur : ", error);
    }
}
function checkFormValidity() {
    if (formAddTitle.value && selectCat.value && btnAddPicture.files.length > 0) {
        btnAddNewPicture.classList.add('active');
    } else {
        btnAddNewPicture.classList.remove('active');
    }
    }
    formAddTitle.addEventListener('input', checkFormValidity);
    selectCat.addEventListener('change', checkFormValidity);
    btnAddPicture.addEventListener('change', checkFormValidity);
    
    btnAddNewPicture.addEventListener('click', sendNewPicture);
   
const adminConnexion = localStorage.getItem("adminEmail") === "sophie.bluel@test.tld";

    if (adminConnexion) {

    let adminHeader = document.querySelector('.admin-header');
    adminHeader.setAttribute('style', 'display: flex');
    let adminPortfolioIntro = document.querySelector('.admin-portfolio-intro');
    adminPortfolioIntro.setAttribute('style', 'display: flex');
    let accessLogin = document.querySelector('.login-access');
    accessLogin.setAttribute('style', 'display: none');
    let accessLogout = document.querySelector('.logout-access');
    accessLogout.setAttribute('style', 'display: inline-block');
    let galleryFilters = document.querySelector('.filters-portfolio');
    galleryFilters.setAttribute('style', 'display: none');
}

const logoutBtn = document.querySelector('.logout-access');

logoutBtn.addEventListener('click', function (e) {
    e.preventDefault();
    localStorage.removeItem('adminEmail');

    window.location.reload();
});

fetchWorksModalContent();

