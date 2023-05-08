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

  // Configuration de l'icône et du libellé "modifier"
  editButton.id = 'edit-btn';
  editButton.className = 'fa-regular fa-pen-to-square', "btn-edit modal-trigger";
  editButton.style.cursor = 'pointer';
  editLabel.textContent = 'modifier';
  editLabel.style.cursor = 'pointer';

  function checkUserStatus() {
    const userToken = localStorage.getItem('userToken');
    if (userToken) {
      // L'utilisateur est connecté, donc ajouter les éléments "modifier"
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
    } else {
      // L'utilisateur est déconnecté, donc supprimer les éléments "modifier"
      if (projectsTitle && projectsTitle.parentElement.contains(editButton)) {
        projectsTitle.parentElement.removeChild(editButton);
        projectsTitle.parentElement.removeChild(editLabel);
      }
      logoutButton.classList.add('hidden');
      loginButton.classList.remove('hidden');
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
  modalContainer.classList.toggle("active");
  function displayWorkModal(data) {
    const modalGalleryEl = document.querySelector(".gallery-modal");
    modalGalleryEl.innerHTML = data.map(item => `
      <figure>
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
}
  
  displayWorkModal(loadedData);
}

