window.sendEmailRequest = function sendEmailRequest() {
    const name = document.getElementById("name").value.trim();
    const surname = document.getElementById("surname").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    // Ajouter un indicateur visuel que la requête est en cours (optionnel)
    const submitBtn = document.querySelector(".btn-submit");
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Envoi<span class="dots-loader"></span>';

    fetch('/sendmail', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({name: name, surname: surname, email:email, message: message})
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Email envoyé avec succès:", data);
            document.getElementById("contactPopup").style.display = 'none';
            document.body.style.overflow = 'auto';

            alert("Email envoyé avec succès !");
            document.getElementById("contactForm").reset();
        })
        .catch(error => {
            console.error("Erreur lors de l'envoi:", error);
            alert("Une erreur s'est produite lors de l'envoi du message.");
        })
        .finally(() => {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Envoyer';
        });
}