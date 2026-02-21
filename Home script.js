// AVATAR INITIAL SETUP

document.addEventListener("DOMContentLoaded", function () {
    const profileContainer = document.getElementById('profileAvatar');
    if (!profileContainer) return;

    const initial = localStorage.getItem('userInitial');
    const color = localStorage.getItem('userAvatarColor');
    const name = localStorage.getItem('userDisplayName');

    if (initial && color) {
        // Replace the <img> with an initial avatar div
        profileContainer.innerHTML = '';
        profileContainer.style.backgroundColor = color;
        profileContainer.style.display = 'flex';
        profileContainer.style.alignItems = 'center';
        profileContainer.style.justifyContent = 'center';
        profileContainer.style.color = 'white';
        profileContainer.style.fontSize = '20px';
        profileContainer.style.fontWeight = '700';
        profileContainer.style.fontFamily = "'Poppins', sans-serif";
        profileContainer.style.letterSpacing = '0.5px';
        profileContainer.textContent = initial;
        profileContainer.title = name || '';
    }
});

// LOGOUT POPUP FUNCTIONS

function toggleLogoutPopup(event) {
    event.preventDefault();
    const popup = document.getElementById('logoutPopup');
    popup.classList.toggle('active');
}

function closeLogoutPopup() {
    const popup = document.getElementById('logoutPopup');
    popup.classList.remove('active');
}

function handleLogout() {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '../login.html';
}

// Close popup when clicking outside
document.addEventListener('DOMContentLoaded', function () {
    const popup = document.getElementById('logoutPopup');
    if (popup) {
        popup.addEventListener('click', function (event) {
            if (event.target === popup) {
                closeLogoutPopup();
            }
        });
    }
});

// LOAD RANDOM RECIPES FROM MEALDB

let isLoading = false;

async function loadRandomRecipes() {
    const grid = document.getElementById("foodGrid");
    if (!grid || isLoading) return;
    isLoading = true;

    const loadingText = document.createElement("p");
    loadingText.innerText = "Loading recipes...";
    grid.appendChild(loadingText);

    for (let i = 0; i < 12; i++) {
        const response = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
        const data = await response.json();
        const meal = data.meals[0];

        const recipeCard = document.createElement("div");
        recipeCard.classList.add("food-card");
        recipeCard.onclick = () => openRecipe(meal.idMeal);

        recipeCard.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <div class="food-info">
                <h4>${meal.strMeal}</h4>
            </div>
            <button class="save-btn" onclick="event.stopPropagation()">Save</button>
        `;

        grid.appendChild(recipeCard);
    }

    loadingText.remove();
    isLoading = false;
}

// INITIAL LOAD

document.addEventListener("DOMContentLoaded", function () {
    loadRandomRecipes();
});

// INFINITE SCROLL

document.addEventListener("DOMContentLoaded", function () {
    const grid = document.getElementById("foodGrid");
    if (!grid) return;

    grid.addEventListener("scroll", () => {
        if (grid.scrollTop + grid.clientHeight >= grid.scrollHeight - 200 && !isLoading) {
            loadRandomRecipes();
        }
    });
});