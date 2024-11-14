const searchBox = document.querySelector(".searchBox");
const searchBtn = document.querySelector(".searchBtn");
const cardContainer = document.querySelector(".card-container");
const recipeDetailsContent = document.querySelector(".recipe-details-content");
const recipeCloseBtn = document.querySelector(".recipe-close-btn");

// Function to get recipes
const fetchRecipes = async (query) => {
  cardContainer.innerHTML = "Fetching Recipes...";
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(
        query
      )}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch recipes");
    }

    const data = await response.json();

    cardContainer.innerHTML = ""; // Clear previous results

    if (data.meals) {
      data.meals.forEach((meal) => {
        // Create recipe card element
        const recipeDiv = document.createElement("div");
        recipeDiv.classList.add("recipe-card");

        recipeDiv.innerHTML = `
                            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                            <h3>${meal.strMeal}</h3>
                            <p>The ${meal.strArea} dish, and belongs to the ${meal.strCategory} category.</p>
                        `;
        const button = document.createElement("button");
        button.textContent = "See Recipe";
        recipeDiv.appendChild(button);

        // Adding EventListener to recipe button
        button.addEventListener("click", () => {
          openRecipePopup(meal);
        });

        cardContainer.appendChild(recipeDiv);
      });
    } else {
      cardContainer.innerHTML = "<p>No recipes found.</p>";
    }
  } catch (error) {
    console.error("Error fetching recipes:", error);
    cardContainer.innerHTML = "<p>Error loading recipes. Please try again.</p>";
  }
};

// Function to fetch ingredients and measurements
const fetchIngredients = (meal) => {
  let ingredientsList = "";
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient) {
      ingredientsList += `<li>${measure || ""} ${ingredient}</li>`;
    } else {
      break;
    }
  }
  return ingredientsList;
};

const openRecipePopup = (meal) => {
  recipeDetailsContent.innerHTML = `
      <h2 class="recipeName">${meal.strMeal}</h2>
      <h3 class="recipeHeading">Ingredients:</h3>
      <ul class="ingredientList">${fetchIngredients(meal)}</ul>
      <div>
        <h3 class="recipeHeading">Instructions:</h3>
        <p class="recipeInstructions">${meal.strInstructions}</p>
      </div>
  `;

  recipeDetailsContent.parentElement.style.display = "block";
};

// Event listener for close button
recipeCloseBtn.addEventListener("click", () => {
  recipeDetailsContent.parentElement.style.display = "none";
});

// Event listener for search button
searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const searchInput = searchBox.value.trim();

  if (searchInput) {
    fetchRecipes(searchInput);
  } else {
    cardContainer.innerHTML = "<p>Please enter a recipe to search.</p>";
  }
});
