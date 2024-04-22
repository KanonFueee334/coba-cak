let currentPage = 1;
const itemsPerPage = 56;
let cachedItems = []; // Array to cache fetched items

function fetchItems(page) {
  // Check if items are already cached for the requested page
  if (cachedItems[page]) {
    renderItems(cachedItems[page]); // If cached, render items from cache
  } else {
    const endpoint = `https://pokeapi.co/api/v2/item?limit=${itemsPerPage}&offset=${(page - 1) * itemsPerPage}`;
    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => {
        let result = data.results;

        // Fetch category information for each item
        Promise.all(result.map(item => fetch(item.url).then(response => response.json())))
          .then(items => {
            // Sort items based on their categories
            items.sort((a, b) => a.category.name.localeCompare(b.category.name));

            // Cache fetched items
            cachedItems[page] = items;

            renderItems(items); // Render items
          });
      });
  }
}

// Function to render items
function renderItems(items) {
  let cards = ""; // Variable to store the generated cards
  items.forEach(item => {
    let itemImage = item.sprites.default;
    let itemName = item.name;
    cards += showCard(itemName, itemImage); // Add the card to the cards variable
  });

  const pokemonContainer = document.querySelector("#pokemon-list");
  pokemonContainer.innerHTML = cards; // Update the HTML content with the generated cards
}

// Function to load the next page of items
function loadNextPage() {
  currentPage++;
  fetchItems(currentPage);
}

// Initial load of items
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
