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

// ── SAVE POPUP ──

let currentSaveMeal = null;   // { id, name, thumb }
let savePrivacy     = 'private';

const PLACEHOLDER_IMAGES = [
    'https://www.themealdb.com/images/media/meals/sytuqu1511553755.jpg',
    'https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg',
    'https://www.themealdb.com/images/media/meals/58oia61564916529.jpg',
    'https://www.themealdb.com/images/media/meals/wyrqqq1468233628.jpg',
    'https://www.themealdb.com/images/media/meals/urzj1d1587670726.jpg',
    'https://www.themealdb.com/images/media/meals/tkxquw1628771028.jpg',
];

function getFolders() {
    return JSON.parse(localStorage.getItem('ccFolders') || '[]');
}

function saveFoldersLocal(folders) {
    localStorage.setItem('ccFolders', JSON.stringify(folders));
}

function openSavePopup(meal) {
    currentSaveMeal = meal;
    document.getElementById('folderSearchInput').value = '';
    renderSaveFolders('');
    document.getElementById('savePopupOverlay').classList.add('active');
}

function closeSavePopup(e) {
    if (!e || e.target === document.getElementById('savePopupOverlay')) {
        document.getElementById('savePopupOverlay').classList.remove('active');
    }
}

function filterFolders(query) {
    renderSaveFolders(query.toLowerCase());
}

function renderSaveFolders(query) {
    const list    = document.getElementById('saveFoldersList');
    const folders = getFolders();
    const filtered = query
        ? folders.filter(f => f.name.toLowerCase().includes(query))
        : folders;

    list.innerHTML = '';

    if (filtered.length === 0) {
        list.innerHTML = `<p style="font-size:13px;color:#9A9A9A;padding:8px 12px;">No folders found.</p>`;
        return;
    }

    filtered.forEach((folder, idx) => {
        const isSaved = currentSaveMeal &&
            (folder.recipes || []).some(r => r.id === currentSaveMeal.id);

        const thumb = folder.coverImage || PLACEHOLDER_IMAGES[idx % PLACEHOLDER_IMAGES.length];
        const lockSvg = folder.privacy === 'private'
            ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="5" y="11" width="14" height="10" rx="2" stroke="#5A5A5A" stroke-width="2" fill="none"/>
                <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="#5A5A5A" stroke-width="2" fill="none"/>
               </svg>`
            : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="4" stroke="#9FB19F" stroke-width="2" fill="none"/>
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" stroke="#9FB19F" stroke-width="2" fill="none"/>
               </svg>`;

        const checkSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#9FB19F"/>
            <path d="M7 12l4 4 6-6" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;

        const item = document.createElement('div');
        item.className = `save-folder-item${isSaved ? ' saved' : ''}`;
        item.innerHTML = `
            <div class="save-folder-thumb">
                <img src="${thumb}" alt="${folder.name}" loading="lazy">
            </div>
            <span class="save-folder-name">${folder.name}</span>
            <div class="save-folder-icon">
                <span class="checkmark">${checkSvg}</span>
                <span class="privacy-icon" style="${isSaved ? 'display:none' : ''}">${lockSvg}</span>
            </div>
        `;
        item.addEventListener('click', () => toggleSaveToFolder(folder.id));
        list.appendChild(item);
    });
}

function toggleSaveToFolder(folderId) {
    if (!currentSaveMeal) return;
    const folders = getFolders();
    const folder  = folders.find(f => f.id === folderId);
    if (!folder) return;

    folder.recipes = folder.recipes || [];
    const idx = folder.recipes.findIndex(r => r.id === currentSaveMeal.id);

    if (idx === -1) {
        folder.recipes.push({
            id:    currentSaveMeal.id,
            name:  currentSaveMeal.name,
            thumb: currentSaveMeal.thumb,
        });
        if (!folder.coverImage) folder.coverImage = currentSaveMeal.thumb;
    } else {
        folder.recipes.splice(idx, 1);
    }

    saveFoldersLocal(folders);
    renderSaveFolders(document.getElementById('folderSearchInput').value.toLowerCase());
}

function openSaveCreateFolder() {
    document.getElementById('newFolderNameInput').value = '';
    selectSavePrivacy('private');
    document.getElementById('createFolderPopup').classList.add('active');
    setTimeout(() => document.getElementById('newFolderNameInput').focus(), 80);
}

function closeCreateFolderPopup(e) {
    if (!e || e.target === document.getElementById('createFolderPopup')) {
        document.getElementById('createFolderPopup').classList.remove('active');
    }
}

function selectSavePrivacy(p) {
    savePrivacy = p;
    document.getElementById('privOptPrivate').className = `privacy-opt${p === 'private' ? ' selected' : ''}`;
    document.getElementById('privOptPublic').className  = `privacy-opt${p === 'public'  ? ' selected' : ''}`;
}

function confirmCreateFolder() {
    const name = document.getElementById('newFolderNameInput').value.trim();
    if (!name) {
        document.getElementById('newFolderNameInput').style.borderColor = '#D4A5A5';
        setTimeout(() => document.getElementById('newFolderNameInput').style.borderColor = '', 1500);
        return;
    }

    const folders = getFolders();
    const newFolder = {
        id:         `folder_${Date.now()}`,
        name,
        privacy:    savePrivacy,
        recipes:    [],
        coverImage: null,
        createdAt:  new Date().toISOString(),
    };
    folders.push(newFolder);
    saveFoldersLocal(folders);

    document.getElementById('createFolderPopup').classList.remove('active');
    renderSaveFolders(document.getElementById('folderSearchInput').value.toLowerCase());
}

// Expose to HTML onclick attributes
window.openSavePopup          = openSavePopup;
window.closeSavePopup         = closeSavePopup;
window.filterFolders          = filterFolders;
window.openSaveCreateFolder   = openSaveCreateFolder;
window.closeCreateFolderPopup = closeCreateFolderPopup;
window.selectSavePrivacy      = selectSavePrivacy;
window.confirmCreateFolder    = confirmCreateFolder;

// Enter key in create-folder popup
document.addEventListener('DOMContentLoaded', function () {
    const nfi = document.getElementById('newFolderNameInput');
    if (nfi) nfi.addEventListener('keydown', e => { if (e.key === 'Enter') confirmCreateFolder(); });
});

// OPEN RECIPE PAGE

function openRecipe(mealId) {
    window.location.href = `recipe.html?id=${mealId}`;
}

window.openRecipe = openRecipe;

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

        const mealData = JSON.stringify({
            id: meal.idMeal,
            name: meal.strMeal,
            thumb: meal.strMealThumb
        }).replace(/"/g, '&quot;');

        recipeCard.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <div class="food-info">
                <h4>${meal.strMeal}</h4>
            </div>
            <button class="save-btn" onclick="event.stopPropagation(); openSavePopup(JSON.parse(this.dataset.meal));" data-meal="${mealData}">Save</button>
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