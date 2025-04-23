
let urlLogin = 'http://localhost:5678/api/';

 function sendLogin() {
    const formConnexion = document.querySelector(".login-form");

    if (!formConnexion) return;

    formConnexion.addEventListener("submit", async function (event) {
        event.preventDefault();
       
        const loginData = {
            email : event.target.querySelector("[name=email]").value,
            password : event.target.querySelector("[name=password]").value,
        };

        const utileCharge = JSON.stringify(loginData);
        localStorage.setItem('adminEmail', loginData.email);

    let errorMessage = document.querySelector(".error-message");
        if (!errorMessage) {
            errorMessage = document.createElement("div");
            errorMessage.classList.add("error-message");
            errorMessage.style.display = "none";
            formConnexion.appendChild(errorMessage);
        }
        errorMessage.style.display = "none";
        
        try {
            const response = await fetch(urlLogin + 'users/login', {
    
            method : "POST",
            headers : { "Content-Type" : "application/json" },
            body : utileCharge,
        });
        
    if (response.ok) {
            const data = await response.json();
            const token = data.token;
            const email = loginData.email;
            console.log("Token reçu :", token);
            
            localStorage.setItem("token", token);   
            console.log("Token enregistré dans le stockage local.");
        
        if (email === "sophie.bluel@test.tld") {
            window.location.href = "index.html";
           

        } else {
            window.location.href = "index.html";
        }} 
        else {
            errorMessage.style.display = "block";
            errorMessage.innerText = "Erreur dans l’identifiant ou le mot de passe";
        }
    } catch (error) {
        errorMessage.style.display = "block";
        errorMessage.innerText = "Erreur de connexion au serveur";
    }

    formConnexion.reset(); 
    });}

sendLogin();



