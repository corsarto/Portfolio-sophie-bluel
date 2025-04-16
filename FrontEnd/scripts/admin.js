let modal = null;
let urlAdmin = 'http://localhost:5678/api/'
let previouslyFocusedElement = null;

const viewModal1 = document.getElementById('modal-content1');
const viewModal2 = document.getElementById('modal-content2');

const openModal = function (e) {
    e.preventDefault()
    previouslyFocusedElement = document.activeElement

    modal = document.querySelector(e.target.getAttribute("href"))
    modal.style.display = null;
    modal.removeAttribute('aria-hidden')
    modal.setAttribute('aria-modal', 'true')

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
}

const closeModal = function (e) {
    if (modal === null) { return }
    e.preventDefault()
    modal.blur();

    modal.style.display = "none"
    modal.setAttribute('aria-hidden', 'true')
    modal.removeAttribute('aria-modal')
    
    const closeButtons = modal.querySelectorAll('.close-modal');
    closeButtons.forEach(btn => {
    btn.removeEventListener('click', closeModal);
});
    modal.removeEventListener('click', closeModal);
    modal.querySelector('.close-modal').removeEventListener('click', closeModal);
    modal.querySelector('.modal-container').removeEventListener('click', stopPropagation)
    
    if (previouslyFocusedElement){ 
        previouslyFocusedElement.focus();}

    modal = null
}

const stopPropagation = function (e) {
    e.stopPropagation()
}

document.querySelectorAll('.admin-portfolio-intro').forEach(a => {
    a.addEventListener('click', openModal);
});


window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
        closeModal(e);
    }
})


async function fetchWorksModalContent() {
    try {
        const response = await fetch( urlAdmin + 'works');
        if (!response.ok) {
            throw new Error("Erreur dans la récupération des projets pour la modale");
        }
        const projetcsModal = await response.json(); 
        

        containerModal(projetcsModal);  
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
                console.log("L'id n'a pas été trouver, suppression annulée.")
                return;
            }
    
            const headers = {
                'Authorization': 'Bearer ' + token,
            }
    
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
    
          }catch(error) {
            console.log("Erreur : ", error);
    
          }
    
          }

    }




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
    

    const btnAddPicture = document.createElement('button');
    btnAddPicture.classList.add('btn-add-picture');
    btnAddPicture.innerText = '+ Ajouter photo';
    

    const txtAddPicture = document.createElement('p');
    txtAddPicture.classList.add('txt-wrapper-picture');
    txtAddPicture.innerText = 'jpg, png : 4mo max'
    

    const formAddNewPicture = document.createElement('div');
    formAddNewPicture.classList.add('form-send-picture');
    

    const labelTitleAdd = document.createElement('label');
    labelTitleAdd.classList.add('label-title')
    labelTitleAdd.textContent = 'Titre';

    const formAddTitle = document.createElement('input');
    formAddTitle.classList.add('title-add-picture');
    formAddTitle.setAttribute('type', 'text');
    formAddTitle.setAttribute('id', 'form-title');

    const labelTitleCat = document.createElement('label');
    labelTitleCat.classList.add('label-title')
    labelTitleCat.textContent = 'Catégorie';

    const selectCat = document.createElement('select');
    selectCat.classList.add('btn-select-cat');

   
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
                    formAddNewPicture.appendChild(selectCat);
        
                    
                    
                    
                     
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
            addPictureWrapper.appendChild(txtAddPicture);
            addPictureContent.appendChild(addPictureWrapper);
            addPictureContent.appendChild(formAddNewPicture);
            viewModal2.appendChild(footModal2);
            footModal2.appendChild(btnAddNewPicture);

        function resetForm() {
            formAddTitle.value = '';
            selectCat.selectedIndex = 0;
        }
            


   



    addBtn.addEventListener('click', () => {

        viewModal1.setAttribute('style', 'display: none');
        viewModal2.setAttribute('style', 'display: flex');

        resetForm();
     });


    btnReturn.addEventListener('click', () => {

        viewModal1.setAttribute('style', 'display: flex');
        viewModal2.setAttribute('style', 'display: none');

        resetForm();

    });

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