let currentPage = 1;
const itemsPerPage = 56;
let cachedItems = [];

//puki
function fetchItems(page) {
  if (cachedItems[page]) {
    renderItems(cachedItems[page]);
  } else {
    const endpoint = `https://pokeapi.co/api/v2/item?limit=${itemsPerPage}&offset=${(page - 1) * itemsPerPage}`;
    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => {
        let result = data.results;

        Promise.all(result.map(item => fetch(item.url).then(response => response.json())))
          .then(items => {
            items.sort((a, b) => a.category.name.localeCompare(b.category.name));

            
            cachedItems[page] = items;

            renderItems(items);
          });
      });
  }
}


function renderItems(items) {
  let cards = "";
  items.forEach(item => {
    let itemImage = item.sprites.default;
    let itemName = item.name;
    cards += showCard(itemName, itemImage);
  });

  const pokemonContainer = document.querySelector("#pokemon-list");
  pokemonContainer.innerHTML = cards;
}

function loadNextPage() {
  currentPage++;
  fetchItems(currentPage);
}

fetchItems(currentPage);

function showCard(itemName, itemImage) {
  return `
  <a href="#">
    <div class="card">
      <img src="${itemImage}" class="card-img-top mx-auto" alt="${itemName}" style="width: 150px">
      <div class="card-body">
        <h5 class="text-center card-title">${itemName}</h5>
      </div>
    </div>
  </a>`;
}

document.addEventListener("DOMContentLoaded", function () {
  var nextButton = document.getElementById("nextButton");
  if (nextButton) {
    nextButton.addEventListener("click", function () {
      loadNextPage();
    });
  } else {
    console.error("Next button not found!");
  }
});
