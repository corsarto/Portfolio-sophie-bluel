
let allProjects = []; 
let url = 'http://localhost:5678/api/'

async function fetchWorks() {
    try {
        const response = await fetch( url + 'works');
        if (!response.ok) {
            throw new Error("Erreur dans la récupération des projets");
        }
        allProjects = await response.json(); 
        

        containerGallery(allProjects);  
    } catch (error) {
        console.error("Erreur : ", error);
    }
}


function containerGallery(data) {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";  

    
    for (let i = 0; i < data.length; i++) {
        const work = data[i];
        
        const figure = document.createElement("figure");

        const img = document.createElement("img");
        img.src = work.imageUrl;
        img.alt = work.title;

        const figcaption = document.createElement("figcaption");
        figcaption.innerText = work.title;

        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    }
}


async function fetchCategories() {
    try {
        const response = await fetch(url + 'categories');
        if (!response.ok) {
            throw new Error("Erreur dans la récupération des catégories");
        }
        const categories = await response.json();
        

        containerFilter(categories);  
    } catch (error) {
        console.error("Erreur : ", error);
    }
}


function containerFilter(categories) {
    const filterContainer = document.querySelector(".filters-portfolio");
    if (filterContainer === null) {
        return;
    }
    
    const filterAll = document.createElement("button");
    filterAll.innerText = "Tous";
    filterAll.classList.add("filter-button");
    filterAll.setAttribute("data-id", "all");
    filterContainer.appendChild(filterAll);

    
    for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        
        const filter = document.createElement("button");
        filter.innerText = category.name;
        filter.setAttribute("data-id", category.id);
        filter.classList.add("filter-button");
        filterContainer.appendChild(filter);

        
        filter.addEventListener("click", () => {
            filterProjects(category.id); 
        });
    }

    filterAll.addEventListener("click", () => {
        filterProjects("all");
    });
}


function filterProjects(categoryId) {
    let filteredProjects;

    if (categoryId === "all") {
        
        filteredProjects = allProjects;
    } else {
        
        filteredProjects = allProjects.filter(project => project.category.id === parseInt(categoryId));
    }

    
    containerGallery(filteredProjects);
}


fetchWorks();
fetchCategories();


