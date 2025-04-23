let modal = null;
let urlAdmin = 'http://localhost:5678/api/';
let previouslyFocusedElement = null;


const viewModal1 = document.getElementById('modal-content1');
const viewModal2 = document.getElementById('modal-content2');

const errorMessage = document.createElement('p');
errorMessage.classList.add('error-message');
errorMessage.setAttribute('style', 'display: none');

const openModal = function (e) {
    e.preventDefault();
    previouslyFocusedElement = document.activeElement;

    modal = document.querySelector(e.target.getAttribute("href"));
    modal.style.display = null;
    modal.removeAttribute('aria-hidden');
    modal.setAttribute('aria-modal', 'true');

    viewModal1.setAttribute('style', 'display: flex');
    viewModal2.setAttribute('style', 'display: none');

    modal.focus();

    const closeButtons = modal.querySelectorAll('.close-modal');
    closeButtons.forEach(btn => {
    btn.addEventListener('click', closeModal);
});
    modal.addEventListener('click', closeModal);
    modal.querySelector('.close-modal').addEventListener('click', closeModal);
    modal.querySelector('.modal-container').addEventListener('click', stopPropagation);
};

const closeModal = function (e) {
    if (modal === null) { return }
    e.preventDefault();
    modal.blur();

    modal.style.display = "none";
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
    
    const closeButtons = modal.querySelectorAll('.close-modal');
    closeButtons.forEach(btn => {
    btn.removeEventListener('click', closeModal);
});
    modal.removeEventListener('click', closeModal);
    modal.querySelector('.close-modal').removeEventListener('click', closeModal);
    modal.querySelector('.modal-container').removeEventListener('click', stopPropagation);
    
    if (previouslyFocusedElement){ 
        previouslyFocusedElement.focus();}
    
    errorMessage.style.display = "none";
    errorMessage.textContent = "";
    modal = null;
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

        trashIcon.addEventListener('click', deleteContent);

        figure.appendChild(img);
        figure.appendChild(trashIcon);
        pictureGallery.appendChild(figure);

        async function deleteContent(event) {
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
            
            
            const figureDelete = event.target.closest("figure");
    
                if(figureDelete){
                    figureDelete.remove();
                }
    
                console.log("Projet supprimer avec succès");
                window.location.reload();
    
          }catch(error) {
            console.log("Erreur : ", error);
    
          }}}

    const footModal1 = document.createElement('div');
    footModal1.classList.add('modal-footer');
    const addBtn = document.createElement('button');
    addBtn.classList.add('btn-add');
    addBtn.innerText = 'Ajouter une photo';

    footModal1.appendChild(addBtn);
    viewModal1.appendChild(footModal1);
    
    const addPictureContent = document.querySelector('.modal-content2');
    const btnReturn = document.querySelector('.return-modal');

    const addPictureWrapper = document.createElement('div');
    addPictureWrapper.classList.add('picture-add-content');
    
    const pictureIcone = document.createElement('i');
    pictureIcone.classList.add('far', 'fa-image', 'icon-picture');
    
    const btnAddPicture = document.createElement('input');
    btnAddPicture.setAttribute('type', 'file');
    btnAddPicture.setAttribute('accept', 'image/png, image/jpg');
    btnAddPicture.setAttribute('style', 'display: none');
    btnAddPicture.id = 'fileInput';
    
    const labelBtnFile = document.createElement('label');
    labelBtnFile.setAttribute('for', 'fileInput');
    labelBtnFile.classList.add('btn-add-picture');
    labelBtnFile.innerText = '+ Ajouter photo';
    
    const txtAddPicture = document.createElement('p');
    txtAddPicture.classList.add('txt-wrapper-picture');
    txtAddPicture.innerText = 'jpg, png : 4mo max';
    
    const formAddNewPicture = document.createElement('div');
    formAddNewPicture.classList.add('form-send-picture');
    
    const labelTitleAdd = document.createElement('label');
    labelTitleAdd.classList.add('label-title');
    labelTitleAdd.textContent = 'Titre';

    const formAddTitle = document.createElement('input');
    formAddTitle.classList.add('title-add-picture');
    formAddTitle.setAttribute('type', 'text');
    formAddTitle.setAttribute('id', 'form-title');

    const labelTitleCat = document.createElement('label');
    labelTitleCat.classList.add('label-title');
    labelTitleCat.textContent = 'Catégorie';

    const selectCat = document.createElement('select');
    selectCat.classList.add('btn-select-cat');

    const iconCat = document.querySelector('.icon-form');

    const formCAt = document.createElement('div');
    formCAt.classList.add('form-select-cat');

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
                    
                    formAddNewPicture.appendChild(labelTitleAdd);
                    formAddNewPicture.appendChild(formAddTitle);
                    formAddNewPicture.appendChild(labelTitleCat);
                    formCAt.appendChild(selectCat);
                    formCAt.appendChild(iconCat);
        
                    } catch (error) {
                    console.error("Erreur : ", error);
                }
    }
    fetchCategoriesModal();
        const btnAddNewPicture = document.createElement('input');
        btnAddNewPicture.classList.add('btn-send-picture');
        btnAddNewPicture.setAttribute('type', 'submit');
        btnAddNewPicture.value= 'Valider';
 
        const footModal2 = document.createElement('div');
        footModal2.classList.add('modal-footer2');

        addPictureContent.appendChild(addPictureWrapper);
        addPictureWrapper.appendChild(pictureIcone);
        addPictureWrapper.appendChild(btnAddPicture);
        addPictureWrapper.appendChild(labelBtnFile);
        addPictureWrapper.appendChild(txtAddPicture);
        addPictureContent.appendChild(addPictureWrapper);
        addPictureContent.appendChild(formAddNewPicture);
        addPictureContent.appendChild(formCAt);
        viewModal2.appendChild(footModal2);
        footModal2.appendChild(btnAddNewPicture);
        footModal2.appendChild(errorMessage);
        
            
        function resetForm() {
            formAddTitle.value = '';
            selectCat.selectedIndex = 0;
            
            const oldPreviewImage = addPictureWrapper.querySelector('img');
            if (oldPreviewImage) {
                oldPreviewImage.remove();
            }

            pictureIcone.setAttribute('style', 'display: flex');
            labelBtnFile.setAttribute('style', 'display: flex');
            txtAddPicture.setAttribute('style', 'display: flex');
        }
            
    addBtn.addEventListener('click', () => {

        viewModal1.setAttribute('style', 'display: none');
        viewModal2.setAttribute('style', 'display: flex');

        resetForm();
        checkFormValidity();
    });

    btnReturn.addEventListener('click', () => {

        viewModal1.setAttribute('style', 'display: flex');
        viewModal2.setAttribute('style', 'display: none');
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
            window.location.reload();
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
}

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

