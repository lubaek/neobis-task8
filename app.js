const searchValue = document.getElementById("search");
const submit = document.getElementById("submit");
const randomBtn = document.getElementById("random");
const mealsEl = document.getElementById("meals");
const resultHeading = document.getElementById("result-heading");
const singleMealEl = document.getElementById("single-meal");

// search meal by keywords
function searchMeal(e) {
    e.preventDefault();

    // clear single meal
    singleMealEl.innerHTML = "";

    // get search term
    const term = searchValue.value;

    // check for empty
    if (term.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                resultHeading.innerHTML = `<h2 class="result-title"> Search results for '${term}': </h2>`;
                if (data.meals === null) {
                    resultHeading.innerHTML = `<h2 class="result-title"> There are no search results. Please, try again ~ </h2>`;
                    mealsEl.innerHTML = "";
                } else {
                    mealsEl.innerHTML = data.meals
                        .map(
                            (meal) => `
                            <div class="meal">
                                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                                <div class="meal-info" data-mealID="${meal.idMeal}">
                                    <h3>${meal.strMeal}</h3>
                                </div>
                            </div>`
                        )
                        .join("");
                }
            });
        // clear search text
        searchValue.value = "";
    }
}

// fetch meal by id
function getMealById(mealID) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
        .then((res) => res.json())
        .then((data) => {
            const meal = data.meals[0];
            addMealToDOM(meal);
        });
}

// fetch random meal from API
function getRandomMeal() {
    mealsEl.innerHTML = "";
    resultHeading.innerHTML = "";
    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
        .then((res) => res.json())
        .then((data) => {
            const meal = data.meals[0];
            addMealToDOM(meal);
        });
}

// add meal to DOM
function addMealToDOM(meal) {
    const ingredients = [];

    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(
                `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
            );
        } else {
            break;
        }
    }

    singleMealEl.innerHTML = `
    <div class="single-meal">
        <h3 class="meal-title">${meal.strMeal}</h3>

        <div class="single-meal-info">
            ${
                meal.strCategory
                    ? `<p class="meal-category">Category: ${meal.strCategory}</p>`
                    : ""
            }
            ${meal.strArea ? `<p class="meal-area">Area: ${meal.strArea}</p>` : ""}
        </div>
        <div class="main">

            <h2 class="ingredients-title"> Ingredients </h2>
            <ul class="ingredients">
                ${ingredients.map((ing) => `<li> ${ing}</li>`).join("")}
            </ul>
            <a href="${
                meal.strYoutube
            }" target="_blank" class="youtube-btn">Watch on YouTube</a>
        </div>
    </div>
    `;
    console.log(ingredients);
    console.log(meal.strMeal);
    getFavBtn();
}

function getFavBtn() {
    const favBtn = document.getElementById("favorite-meal");
    favBtn.addEventListener("click", function (e) {
        e.preventDefault();
        if (favBtn.classList.contains("red-btn")) {
            favBtn.classList.remove("red-btn");
        } else {
            favBtn.classList.add("red-btn");
        }
    });
}

// event listeners
submit.addEventListener("submit", searchMeal);
randomBtn.addEventListener("click", getRandomMeal);

mealsEl.addEventListener("click", (e) => {
    const mealInfo = e.path.find((item) => {
        if (item.classList) {
            return item.classList.contains("meal-info");
        } else {
            return;
        }
    });
    if (mealInfo) {
        const mealID = mealInfo.getAttribute("data-mealID");
        getMealById(mealID);
    }
});
