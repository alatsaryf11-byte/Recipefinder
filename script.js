/*
 * SKL 2 — RECIPE FINDER API
 * API: DummyJSON Recipes
 * https://dummyjson.com/recipes
 *
 * Fitur:
 * - Fetch API
 * - Render recipe cards ke DOM
 * - Search berdasarkan nama
 * - Filter cuisine & difficulty
 * - Detail recipe dengan <dialog>
 * - Favorite dengan LocalStorage
 * - Responsive UI dari starter project
 */

const API_URL = "https://dummyjson.com/recipes?limit=0";
const STORAGE_KEY = "recipeFinderFavorites";

// =========================
// 1. Ambil elemen dari DOM
// =========================
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const cuisineFilter = document.querySelector("#cuisine-filter");
const difficultyFilter = document.querySelector("#difficulty-filter");
const resetButton = document.querySelector("#reset-filter-button");
const favoriteButton = document.querySelector("#favorite-button");
const favoriteCount = document.querySelector("#favorite-count");

const recipeGrid = document.querySelector("#recipe-grid");
const loadingState = document.querySelector("#loading-state");
const errorState = document.querySelector("#error-state");
const emptyState = document.querySelector("#empty-state");
const recipeCount = document.querySelector("#recipe-count");
const sectionTitle = document.querySelector("#section-title");

const recipeDialog = document.querySelector("#recipe-dialog");
const closeDialog = document.querySelector("#close-dialog");
const dialogContent = document.querySelector("#dialog-content");

// =========================
// 2. State aplikasi
// =========================
let recipes = [];
let filteredRecipes = [];
let favoriteIds = loadFavorites();
let showingFavorites = false;

// =========================
// 3. LocalStorage
// =========================
function loadFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved.map(Number) : [];
  } catch (error) {
    console.warn("Favorite tidak dapat dibaca dari LocalStorage:", error);
    return [];
  }
}

function saveFavorites() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds));
  updateFavoriteCount();
}

function isFavorite(id) {
  return favoriteIds.includes(Number(id));
}

function toggleFavorite(id) {
  id = Number(id);

  if (isFavorite(id)) {
    favoriteIds = favoriteIds.filter((favoriteId) => favoriteId !== id);
  } else {
    favoriteIds.push(id);
  }

  saveFavorites();
  applyFilters();
}

// =========================
// 4. Fetch data dari API
// =========================
async function fetchRecipes() {
  showState("loading");

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();

    recipes = Array.isArray(data.recipes) ? data.recipes : [];

    populateCuisineFilter();
    updateFavoriteCount();
    applyFilters();
  } catch (error) {
    console.error("Gagal mengambil data recipe:", error);
    showState("error");
    recipeCount.textContent = "0 recipes";
  }
}

// =========================
// 5. Isi pilihan cuisine
// =========================
function populateCuisineFilter() {
  const cuisines = [...new Set(
    recipes
      .map((recipe) => recipe.cuisine)
      .filter(Boolean)
  )].sort((a, b) => a.localeCompare(b));

  cuisineFilter.innerHTML = `
    <option value="">All Cuisine</option>
    ${cuisines.map((cuisine) => `
      <option value="${escapeHTML(cuisine)}">${escapeHTML(cuisine)}</option>
    `).join("")}
  `;
}

// =========================
// 6. Search + filter
// =========================
function applyFilters() {
  const keyword = searchInput.value.trim().toLowerCase();
  const cuisine = cuisineFilter.value;
  const difficulty = difficultyFilter.value;

  filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.name.toLowerCase().includes(keyword);
    const matchesCuisine = !cuisine || recipe.cuisine === cuisine;
    const matchesDifficulty = !difficulty || recipe.difficulty === difficulty;
    const matchesFavorites = !showingFavorites || isFavorite(recipe.id);

    return (
      matchesSearch &&
      matchesCuisine &&
      matchesDifficulty &&
      matchesFavorites
    );
  });

  renderRecipes(filteredRecipes);
  updateUIState();
}

// =========================
// 7. Render recipe cards
// ========================= 03
function renderRecipes(items) {
  recipeGrid.innerHTML = items.map(createRecipeCard).join("");
}

function createRecipeCard(recipe) {
  const favorite = isFavorite(recipe.id);

  return `
    <article class="recipe-card">
      <img
        class="recipe-image"
        src="${escapeAttribute(recipe.image)}"
        alt="${escapeAttribute(recipe.name)}"
        loading="lazy"
      >

      <div class="recipe-body">
        <span class="recipe-cuisine">
          ${escapeHTML(recipe.cuisine || "Unknown")}
        </span>

        <h3 class="recipe-title">${escapeHTML(recipe.name)}</h3>

        <div class="recipe-meta">
          <span>⭐ ${Number(recipe.rating || 0).toFixed(1)}</span>
          <span>⏱️ ${escapeHTML(String(recipe.totalTimeMinutes ?? "?"))} min</span>
          <span>👥 ${escapeHTML(String(recipe.servings ?? "?"))} servings</span>
          <span>📊 ${escapeHTML(recipe.difficulty || "Unknown")}</span>
        </div>

        <div class="recipe-actions">
          <button
            class="detail-button"
            type="button"
            data-action="detail"
            data-id="${recipe.id}"
          >
            View Detail
          </button>

          <button
            class="like-button"
            type="button"
            data-action="favorite"
            data-id="${recipe.id}"
            aria-label="${favorite ? "Remove from favorites" : "Add to favorites"}"
            title="${favorite ? "Remove from favorites" : "Add to favorites"}"
          >
            ${favorite ? "❤️" : "♡"}
          </button>
        </div>
      </div>
    </article>
  `;
}

// =========================
// 8. Detail recipe
// ========================= 04
function openRecipeDetail(id) {
  const recipe = recipes.find((item) => Number(item.id) === Number(id));

  if (!recipe) return;

  const ingredients = Array.isArray(recipe.ingredients)
    ? recipe.ingredients
    : [];

  const instructions = Array.isArray(recipe.instructions)
    ? recipe.instructions
    : [];

  dialogContent.innerHTML = `
    <img
      class="dialog-image"
      src="${escapeAttribute(recipe.image)}"
      alt="${escapeAttribute(recipe.name)}"
    >

    <div class="dialog-body">
      <span class="recipe-cuisine">
        ${escapeHTML(recipe.cuisine || "Unknown")}
      </span>

      <h2>${escapeHTML(recipe.name)}</h2>

      <div class="dialog-meta">
        <span>⭐ ${Number(recipe.rating || 0).toFixed(1)} (${escapeHTML(String(recipe.reviewCount ?? 0))} reviews)</span>
        <span>⏱️ ${escapeHTML(String(recipe.totalTimeMinutes ?? "?"))} min</span>
        <span>👥 ${escapeHTML(String(recipe.servings ?? "?"))} servings</span>
        <span>📊 ${escapeHTML(recipe.difficulty || "Unknown")}</span>
        <span>🔥 ${escapeHTML(String(recipe.caloriesPerServing ?? "?"))} cal/serving</span>
      </div>

      <h3>🛒 Ingredients</h3>
      <ul class="ingredients">
        ${ingredients.length
          ? ingredients.map((item) => `<li>${escapeHTML(item)}</li>`).join("")
          : "<li>Ingredients not available.</li>"
        }
      </ul>

      <h3>👨‍🍳 Instructions</h3>
      <div class="instructions">
        ${instructions.length
          ? instructions.map((step, index) => `
              <p><strong>Step ${index + 1}.</strong> ${escapeHTML(step)}</p>
            `).join("")
          : "<p>Instructions not available.</p>"
        }
      </div>
    </div>
  `;

  if (typeof recipeDialog.showModal === "function") {
    recipeDialog.showModal();
  } else {
    recipeDialog.setAttribute("open", "");
  }
}

function closeRecipeDetail() {
  if (typeof recipeDialog.close === "function") {
    recipeDialog.close();
  } else {
    recipeDialog.removeAttribute("open");
  }
}

// =========================
// 9. Event DOM
// =========================
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  applyFilters();
});

searchInput.addEventListener("input", applyFilters);
cuisineFilter.addEventListener("change", applyFilters);
difficultyFilter.addEventListener("change", applyFilters);

resetButton.addEventListener("click", () => {
  searchInput.value = "";
  cuisineFilter.value = "";
  difficultyFilter.value = "";
  showingFavorites = false;
  favoriteButton.innerHTML = `❤️ Favorites <span id="favorite-count">${favoriteIds.length}</span>`;
  updateFavoriteCount();
  applyFilters();
});

favoriteButton.addEventListener("click", () => {
  showingFavorites = !showingFavorites;

  favoriteButton.innerHTML = `
    ${showingFavorites ? "🍳 All Recipes" : "❤️ Favorites"}
    <span id="favorite-count">${favoriteIds.length}</span>
  `;

  applyFilters();
});

recipeGrid.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const id = Number(button.dataset.id);
  const action = button.dataset.action;

  if (action === "detail") {
    openRecipeDetail(id);
  }

  if (action === "favorite") {
    toggleFavorite(id); 
  }
});

closeDialog.addEventListener("click", closeRecipeDetail);

recipeDialog.addEventListener("click", (event) => {
  if (event.target === recipeDialog) {
    closeRecipeDetail();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && recipeDialog.hasAttribute("open")) {
    closeRecipeDetail();
  }
});

// =========================
// 10. Tampilan UI
// =========================
function updateFavoriteCount() {
  const countElement = document.querySelector("#favorite-count");
  if (countElement) {
    countElement.textContent = favoriteIds.length;
  }
}

function updateUIState() {
  const hasResults = filteredRecipes.length > 0;
  const hasRecipes = recipes.length > 0;

  recipeCount.textContent = `${filteredRecipes.length} recipe${filteredRecipes.length === 1 ? "" : "s"}`;

  if (showingFavorites) {
    sectionTitle.textContent = "Favorite Recipes";
  } else if (
    searchInput.value.trim() ||
    cuisineFilter.value ||
    difficultyFilter.value
  ) {
    sectionTitle.textContent = "Search Results";
  } else {
    sectionTitle.textContent = "Explore Recipes";
  }

  loadingState.hidden = true;
  errorState.hidden = true;
  emptyState.hidden = hasResults;
  recipeGrid.hidden = !hasResults;

  resetButton.hidden = !(
    searchInput.value.trim() ||
    cuisineFilter.value ||
    difficultyFilter.value ||
    showingFavorites
  );

  if (!hasRecipes) {
    emptyState.hidden = false;
    recipeGrid.hidden = true;
  }

  if (showingFavorites && !hasResults) {
    emptyState.querySelector("h3").textContent = "❤️ No favorites yet";
    emptyState.querySelector("p").textContent =
      "Click the heart button on a recipe to save it here.";
  } else {
    emptyState.querySelector("h3").textContent = "🔍 Recipe not found";
    emptyState.querySelector("p").textContent =
      "Try another keyword or filter.";
  }
}

function showState(state) {
  loadingState.hidden = state !== "loading";
  errorState.hidden = state !== "error";
  emptyState.hidden = true;
  recipeGrid.hidden = true;
}

// =========================
// 11. Keamanan output HTML
// =========================
function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHTML(value);
}

// =========================
// 12. Jalankan aplikasi
// =========================
updateFavoriteCount();
fetchRecipes();
