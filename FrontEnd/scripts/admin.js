let modal = null;
let urlAdmin = 'http://localhost:5678/api/'
let previouslyFocusedElement = null;
const openModal = function (e) {
    e.preventDefault()
    previouslyFocusedElement = document.activeElement

    modal = document.querySelector(e.target.getAttribute("href"))
    modal.style.display = null;
    modal.removeAttribute('aria-hidden')
    modal.setAttribute('aria-modal', 'true')

    modal.focus();


    modal.addEventListener('click', closeModal)
    modal.querySelector('.close-modal').addEventListener('click', closeModal)

    modal.querySelector('.modal-container').addEventListener('click', stopPropagation)

}

const closeModal = function (e) {
    if (modal === null) { return }
    e.preventDefault()
    modal.blur();

    modal.style.display = "none"
    modal.setAttribute('aria-hidden', 'true')
    modal.removeAttribute('aria-modal')
    modal.removeEventListener('click', closeModal)
    modal.querySelector('.close-modal').removeEventListener('click', closeModal)
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

    const pictureModal = document.querySelector('.modal-content1');
    const containerModal = document.querySelector('.modal-container');
    pictureModal.innerHTML = '';


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
        pictureModal.appendChild(figure);

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




    const footModal = document.createElement('div');
    footModal.classList.add('modal-footer');
    const addBtn = document.createElement('button');
    addBtn.classList.add('btn-add');
    addBtn.innerText = 'Ajouter une photo';





    footModal.appendChild(addBtn);
    containerModal.appendChild(footModal);

    const titleModalAdd = document.getElementById('title-modal2');
    const titalModalPicture = document.getElementById('title-modal1');
    const addPictureContent = document.querySelector('.modal-content2');
    const btnReturn = document.querySelector('.return-modal');

    const addPictureWrapper = document.createElement('div');
    addPictureWrapper.classList.add('picture-add-content');
    const pictureIcone = document.createElement('i');
    pictureIcone.classList.add('far', 'fa-image', 'icon-picture');
    pictureIcone.setAttribute('style', 'display: none;');

    const btnAddPicture = document.createElement('button');
    btnAddPicture.classList.add('btn-add-picture');
    btnAddPicture.innerText = '+ Ajouter photo';
    btnAddPicture.setAttribute('style', 'display: none;');

    const txtAddPicture = document.createElement('p');
    txtAddPicture.classList.add('txt-wrapper-picture');
    txtAddPicture.innerText = 'jpg, png : 4mo max'
    txtAddPicture.setAttribute('style', 'display: none;');






    addPictureContent.appendChild(addPictureWrapper);
    addPictureWrapper.appendChild(pictureIcone);
    addPictureWrapper.appendChild(btnAddPicture);
    addPictureWrapper.appendChild(txtAddPicture);

    addBtn.addEventListener('click', () => {

        titleModalAdd.setAttribute('style', 'display: flex;');
        titalModalPicture.setAttribute('style', 'display: none;');
        pictureModal.setAttribute('style', 'display: none;');
        addBtn.setAttribute('style', 'display: none;');
        btnReturn.setAttribute('style', 'display: flex;');
        addPictureContent.setAttribute('style', 'display: flex;');
        pictureIcone.setAttribute('style', 'display: flex;');
        btnAddPicture.setAttribute('style', 'display: flex;');
        txtAddPicture.setAttribute('style', 'display: flex;');




    });


    btnReturn.addEventListener('click', () => {

        titleModalAdd.setAttribute('style', 'display: none;');
        titalModalPicture.setAttribute('style', 'display: flex;');
        pictureModal.setAttribute('style', 'display: flex;');
        addBtn.setAttribute('style', 'display: flex;');
        btnReturn.setAttribute('style', 'display: none;');
        addPictureContent.setAttribute('style', 'display: none;');
        pictureIcone.setAttribute('style', 'display: none;');
        btnAddPicture.setAttribute('style', 'display: none;');
        txtAddPicture.setAttribute('style', 'display: none;');

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