// Works import from API //
let loadedData = [];

async function loadWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  loadedData = await response.json();
  displayWork(loadedData);
}

function displayWork(data) {
  const galleryEl = document.querySelector(".gallery");
  galleryEl.innerHTML = data.map(item => `
    <figure>
      <img src="${item.imageUrl}" alt="${item.title}" crossorigin="anonymous">
      <figcaption>${item.title}</figcaption>
    </figure>
  `).join('');
}

loadWorks();

// Category import from API //

async function loadCategory() {
  const response = await fetch("http://localhost:5678/api/categories");
  const loadedData = await response.json();
  displayCategory(loadedData);
}

// filter works //

const filterWorks = document.querySelector("#filter-works-all");
const filterWorksObjets = document.querySelector("#filter-works-Object");
const filterWorksAppartements = document.querySelector("#filter-works-Appartements");
const filterWorksHR = document.querySelector("#filter-works-HR");

filterWorks.addEventListener("click", function () {
  displayWork(loadedData);
});

filterWorksObjets.addEventListener("click", function() {
  const filteredData = loadedData.filter(item => item.category.id === 1); 
  displayWork(filteredData);
});

filterWorksAppartements.addEventListener("click", function() {
  const filteredData = loadedData.filter(item => item.category.id === 2);
  displayWork(filteredData);
});

filterWorksHR.addEventListener("click", function() {
  const filteredData = loadedData.filter(item => item.category.id === 3);
  displayWork(filteredData);
});

// display banner User Connecté //

function showUserBanner() {
  const userToken = localStorage.getItem("userToken");

  if (userToken) {
    const userBanner = document.getElementById('user-banner');
    userBanner.style.display = 'flex';
  }
}

showUserBanner();

// Affiche des boutons login et logout en fonction de l'état de connexion de l'utilisateur
// Affiche aussi le bouton "modifier" sur la page des projets

document.addEventListener('DOMContentLoaded', function() {
  const loginButton = document.querySelector('.login-btn');
  const logoutButton = document.querySelector('.logout-btn');
  const editButton = document.createElement('i');
  const editLabel = document.createElement('p');
  const projectsTitle = document.querySelector('.projet-title');
  const filters = document.getElementById('filters');

  // Configuration de l'icône et du libellé "modifier"
  editButton.id = 'edit-btn';
  editButton.className = 'fa-regular fa-pen-to-square', "btn-edit modal-trigger";
  editButton.style.cursor = 'pointer';
  editLabel.textContent = 'modifier';
  editLabel.style.cursor = 'pointer';

  function checkUserStatus() {
    const userToken = localStorage.getItem('userToken');
    if (userToken) {
      // L'utilisateur est connecté, ajouter les éléments "modifier"
      if (projectsTitle) {
        projectsTitle.parentElement.insertBefore(editLabel, projectsTitle.nextElementSibling);
        projectsTitle.parentElement.insertBefore(editButton, projectsTitle.nextElementSibling);
  
        editButton.addEventListener('click', function() {
          toggleModal();
        });
        editLabel.addEventListener('click', function() {
          toggleModal();
        });
      }
      logoutButton.classList.remove('hidden');
      loginButton.classList.add('hidden');
      if (filters) {
        filters.classList.add('hidden');
        console.log("filters cachés");
      }
    } else {
      // L'utilisateur est déconnecté, supprimer les éléments "modifier"
      if (projectsTitle && projectsTitle.parentElement.contains(editButton)) {
        projectsTitle.parentElement.removeChild(editButton);
        projectsTitle.parentElement.removeChild(editLabel);
      }
      logoutButton.classList.add('hidden');
      loginButton.classList.remove('hidden');
      if (filters) {
        filters.classList.remove('hidden');
        console.log("filters affichés");
      }
    }
  }
  
  if (logoutButton) {
    checkUserStatus();
    logoutButton.addEventListener('click', function logout() {
      localStorage.removeItem('userToken');
      if (projectsTitle && projectsTitle.parentElement.contains(editButton)) {
        projectsTitle.parentElement.removeChild(editButton);
        projectsTitle.parentElement.removeChild(editLabel);
      }
      logoutButton.classList.add('hidden');
      loginButton.classList.remove('hidden');
      window.location.href = 'index.html';
    });
  }
});


// Modal Edition Travaux //

const modalContainer = document.querySelector(".modal-container");
const modalTriggers = document.querySelectorAll(".modal-trigger");

modalTriggers.forEach(trigger => trigger.addEventListener("click", toggleModal))

function toggleModal() {
  console.log("Toggle modal");
  modalContainer.classList.toggle("active");
  displayWorkModal(loadedData);
}

// Suppression d'un projet //
async function deleteWork() {
  console.log("Delete clicked");
  const workId = this.parentElement.parentElement.parentElement.dataset.id;
  const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('userToken')}`,
    },
  });

  if (response.ok) {
    console.log('Projet supprimé');
    const work = document.querySelector(`[data-id="${workId}"]`);
    work.remove();
  } else {
    alert('Une erreur est survenue lors de la suppression du projet.');
  }
}

function displayWorkModal(data) {
  const modalGalleryEl = document.querySelector(".gallery-modal");
  modalGalleryEl.innerHTML = data.map(item => `
      <figure data-id="${item.id}">
        <img src="${item.imageUrl}" alt="${item.title}" crossorigin="anonymous">
        <figcaption>éditer</figcaption>
        <div class="icon-container">
            <span class="move-icon">
                <i class="fa-solid fa-arrows-up-down-left-right"></i>
            </span>
            <span class="delete-icon">
                <i class="fa-solid fa-trash-can"></i>
            </span>
        </div>
      </figure>
    `).join('');

  // Attache l'événement de suppression à chaque image dans la galerie
  const deleteIcons = modalGalleryEl.querySelectorAll(".delete-icon");
  deleteIcons.forEach(icon => icon.addEventListener("click", deleteWork));

  // Attache l'événement de suppression à la galerie elle-même
  modalGalleryEl.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-icon')) {
      deleteWork.call(event.target);
    }
  });
}

async function deleteWork() {
  const workId = this.parentElement.parentElement.dataset.id;
  const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('userToken')}`,
    },
  });

  if (response.ok) {
    const work = document.querySelector(`[data-id="${workId}"]`);
    if (work) {
      work.remove();
      alert('Projet supprimé !');
    } else {
      console.log(`Element with data-id="${workId}" not found`);
    }
  } else {
    alert('Une erreur est survenue lors de la suppression du projet.');
  }
}

// Ouverture modale d'ajout d'un projet //
// Récupération des éléments HTML
const addWorkTriggerEl = document.querySelector(".valid-btn");
const addModalEl = document.getElementById("modal-add");
const editModalEl = document.querySelector(".modal-container");

const backToEditModalBtn = document.querySelector('.back-to-edit-modal');
const closeAddModalBtn = document.querySelector('#modal-add .close-modal');
const addPhotoLabel = document.querySelector('.add-photo');
const loadImgContainer = document.querySelector('.load-img');

addWorkTriggerEl.addEventListener("click", () => {
  const modalEl = document.querySelector(".modal-container.active");
  if (modalEl && modalEl.id === "modal-edit") {
    // Masquer la modale d'édition
    modalEl.classList.remove("active");
    // Ouvrir la deuxième modale
    addModalEl.classList.add("active");
  }
});

// Fermeture modale d'ajout d'un projet et retour sur Modale édition //
backToEditModalBtn.addEventListener('click', () => {
  addModalEl.classList.remove('active');
  editModalEl.classList.add('active');
});

closeAddModalBtn.addEventListener('click', () => {
  addModalEl.classList.remove('active');
  editModalEl.classList.add('active');
});

//Ajout d'un projet //
const addWorkForm = document.getElementById('add-work-form');
const loadImgContainer2 = document.querySelector('.load-img');

// Ajouter un événement pour l'affichage de l'aperçu de l'image sélectionnée
const imageInput = document.getElementById('image');
imageInput.addEventListener('input', function () {
  const imageFile = this.files[0];
  if (imageFile) {
    const reader = new FileReader();
    reader.addEventListener('load', function () {
      const imgPreview = document.createElement('img');
      imgPreview.src = this.result;
      loadImgContainer2.innerHTML = '';
      loadImgContainer2.appendChild(imgPreview);
      addPhotoLabel.textContent = '+ Changer photo';
    });
    reader.readAsDataURL(imageFile);
  }
});

addWorkForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const authToken = localStorage.getItem("userToken");
  const url = 'http://localhost:5678/api/works';
  const formData = new FormData();

  // Ajouter les données du formulaire à l'objet FormData
  const title = document.getElementById('title').value;
  const category = document.getElementById('category').value;
  const image = imageInput.files[0];
  formData.append('title', title);
  formData.append('category', category);
  formData.append('image', image);

  fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      Authorization: `Bearer ${authToken}`
    },
    body: formData
  })
  .then(response => {
    if (response.ok) {
      alert('Projet ajouté !');
      return response.json();
    } else {
      throw new Error('Une erreur est survenue');
    }
  })
  .then(data => {
    console.log(data);
    // Fermer la modale d'ajout
    addModalEl.classList.remove('active');
    // Recharger la liste des projets
    loadWorks();
  })
  .catch(error => {
    console.error(error);
  });
});

