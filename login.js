// Sélectionne le formulaire avec la classe 'login' et ajoute un listener sur le bouton 'submit'.
document.querySelector('.login').addEventListener('submit', async (event) => {

    // Empêche le comportement par défaut du formulaire, qui est de soumettre et de recharger la page.
    event.preventDefault();

    // Récupère les valeurs des champs email et mot de passe du formulaire.
    const email = event.target.elements.email.value;
    const password = event.target.elements.psw.value;
  
    // Utilise un bloc 'try' pour gérer les erreurs.
    try {
      // requête POST à l'API avec les données du formulaire.
      const response = await fetch("http://localhost:5678/api/users/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      // Si la réponse n'est pas ok lance une erreur.
      if (!response.ok) {
        throw new Error('Erreur lors de la connexion. Vérifiez vos identifiants.');
      }
  
      // Convertit la réponse en objet JSON.
      const data = await response.json();
      
      // Récupère le token de l'objet JSON.
      const token = data.token;
  
      // Si token reçu, stocke-le dans le localStorage et redirection vers la page index.html.
      if (token) {
        localStorage.setItem('userToken', token);
        window.location.href = 'index.html';

      } else {

        // Si aucun token n'est reçu
        throw new Error('Token non reçu.');
      }
    } catch (error) {

      // Si erreur : message d'erreur dans la console et alerte utilisateur.
      console.error('Erreur:', error);
      alert('Une erreur est survenue lors de la connexion. Veuillez réessayer.');
    }
  });
  