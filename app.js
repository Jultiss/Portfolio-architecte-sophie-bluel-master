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
    alert('Projet supprimé : ' + workId);
    const work = document.querySelector(`[data-id="${workId}"]`);
    work.remove();
  } else {
    alert('Une erreur est survenue lors de la suppression du projet.');
  }
}

// Ajout d'un projet //






