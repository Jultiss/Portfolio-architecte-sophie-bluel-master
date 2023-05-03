let loadedData = [];

async function loadWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  loadedData = await response.json();
  displayWork(loadedData);
};

function displayWork(data) {
  const galleryEl = document.querySelector(".gallery");
  galleryEl.innerHTML = data.map(item => `
    <figure>
      <img src="${item.imageUrl}" alt="${item.title}" crossorigin="anonymous">
      <figcaption>${item.title}</figcaption>
    </figure>
  `).join('');
};

loadWorks();
