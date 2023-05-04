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