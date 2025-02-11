import { Recipe, Ingredient } from '../models/recipe.js';
import ShoppingList from '../models/shoppingList.js';

// Beispiel-Rezepte
const recipes = [
    new Recipe(
        '1',
        'Spaghetti Bolognese',
        'Klassische italienische Pasta mit Hackfleischsoße',
        [
            new Ingredient('Spaghetti', 500, 'g'),
            new Ingredient('Hackfleisch', 400, 'g'),
            new Ingredient('Tomaten', 400, 'g'),
            new Ingredient('Zwiebeln', 2, 'Stück'),
            new Ingredient('Knoblauch', 2, 'Zehen')
        ],
        [
            'Wasser zum Kochen bringen und salzen',
            'Zwiebeln und Knoblauch fein hacken',
            'Hackfleisch anbraten',
            'Tomaten hinzufügen und köcheln lassen',
            'Pasta al dente kochen',
            'Mit Salz und Pfeffer abschmecken'
        ],
        30,
        4,
        'https://example.com/spaghetti.jpg'
    )
];

const shoppingList = new ShoppingList();

// DOM Elements
const recipeList = document.getElementById('recipe-list');
const shoppingItems = document.getElementById('shopping-items');
const addItemForm = document.getElementById('add-item-form');
const recipeModal = document.getElementById('recipe-modal');
const recipeDetail = document.getElementById('recipe-detail');
const closeButtons = document.querySelectorAll('.close');
const addToShoppingListBtn = document.getElementById('add-to-shopping-list');
const categoryFilter = document.getElementById('category-filter');
const addRecipeBtn = document.getElementById('add-recipe-btn');
const recipeFormModal = document.getElementById('recipe-form-modal');
const recipeForm = document.getElementById('recipe-form');
const addIngredientBtn = document.getElementById('add-ingredient');
const addInstructionBtn = document.getElementById('add-instruction');
const ingredientsList = document.getElementById('ingredients-list');
const instructionsList = document.getElementById('instructions-list');

let editingRecipeId = null;

// Rezepte anzeigen
function renderRecipes(filteredRecipes = recipes) {
    recipeList.innerHTML = filteredRecipes.map(recipe => `
        <div class="recipe-card">
            ${recipe.imageUrl ? `<img src="${recipe.imageUrl}" alt="${recipe.name}">` : ''}
            <div class="recipe-info">
                <h2>${recipe.name}</h2>
                <p>${recipe.description}</p>
                <div class="recipe-meta">
                    <span>🕒 ${recipe.prepTime} Min</span>
                    <span>👥 ${recipe.servings} Portionen</span>
                </div>
                <div class="recipe-tags">
                    <span class="tag">${recipe.difficulty}</span>
                    ${recipe.category ? `<span class="tag">${recipe.category}</span>` : ''}
                </div>
                <div class="recipe-actions">
                    <button onclick="event.stopPropagation(); openRecipeForm('${recipe.id}')">
                        Bearbeiten
                    </button>
                    <button onclick="event.stopPropagation(); showRecipeDetail('${recipe.id}')">
                        Details
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Einkaufsliste anzeigen
function renderShoppingList() {
    shoppingItems.innerHTML = shoppingList.items.map(item => `
        <li>
            <input type="checkbox" ${item.checked ? 'checked' : ''} 
                   onchange="toggleItem('${item.id}')">
            <span>${item.amount} ${item.unit} ${item.name}</span>
        </li>
    `).join('');
}

// Event Listeners
addItemForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('item-name').value;
    const amount = document.getElementById('item-amount').value;
    const unit = document.getElementById('item-unit').value;
    
    shoppingList.addItem(name, amount, unit);
    renderShoppingList();
    addItemForm.reset();
});

// Rezeptdetails anzeigen
function showRecipeDetail(recipeId) {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return;

    recipeDetail.innerHTML = `
        <h2>${recipe.name}</h2>
        ${recipe.imageUrl ? `<img src="${recipe.imageUrl}" alt="${recipe.name}" style="max-width: 100%;">` : ''}
        <p>${recipe.description}</p>
        
        <h3>Zutaten:</h3>
        <ul>
            ${recipe.ingredients.map(ing => 
                `<li>${ing.amount} ${ing.unit} ${ing.name}</li>`
            ).join('')}
        </ul>

        <h3>Zubereitung:</h3>
        <ol>
            ${recipe.instructions.map(step => 
                `<li class="instruction-step">${step}</li>`
            ).join('')}
        </ol>
    `;

    recipeModal.style.display = 'block';
    
    // Speichere das aktuelle Rezept für die Einkaufsliste
    addToShoppingListBtn.onclick = () => {
        recipe.addToShoppingList(shoppingList);
        renderShoppingList();
        recipeModal.style.display = 'none';
    };
}

// Event Listeners für alle Close-Buttons
closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        if (modal.id === 'recipe-form-modal') {
            closeRecipeForm();
        } else {
            modal.style.display = 'none';
        }
    });
});

// Klick außerhalb der Modals schließt sie
window.onclick = (event) => {
    if (event.target.classList.contains('modal')) {
        if (event.target.id === 'recipe-form-modal') {
            closeRecipeForm();
        } else {
            event.target.style.display = 'none';
        }
    }
};

categoryFilter.addEventListener('change', (e) => {
    const category = e.target.value;
    const filteredRecipes = category 
        ? recipes.filter(recipe => recipe.category === category)
        : recipes;
    renderRecipes(filteredRecipes);
});

// Für checkbox toggle
window.toggleItem = (id) => {
    shoppingList.toggleItem(id);
    renderShoppingList();
};

// Füge die showRecipeDetail Funktion zum window-Objekt hinzu
window.showRecipeDetail = showRecipeDetail;

// Zutat-Zeile erstellen
function createIngredientRow(ingredient = { name: '', amount: '', unit: '' }) {
    const div = document.createElement('div');
    div.className = 'flex gap-2';
    div.innerHTML = `
        <input type="text" placeholder="Name" value="${ingredient.name}" required
               class="flex-grow p-2 border rounded">
        <input type="number" placeholder="Menge" value="${ingredient.amount}" required
               class="w-24 p-2 border rounded">
        <input type="text" placeholder="Einheit" value="${ingredient.unit}" required
               class="w-24 p-2 border rounded">
        <button type="button" onclick="this.parentElement.remove()"
                class="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600">×</button>
    `;
    return div;
}

// Anweisungs-Zeile erstellen
function createInstructionRow(instruction = '') {
    const div = document.createElement('div');
    div.className = 'flex gap-2';
    div.innerHTML = `
        <input type="text" placeholder="Anweisung" value="${instruction}" required
               class="flex-grow p-2 border rounded">
        <button type="button" onclick="this.parentElement.remove()"
                class="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600">×</button>
    `;
    return div;
}

// Formular öffnen
function openRecipeForm(recipeId = null) {
    editingRecipeId = recipeId;
    const recipe = recipeId ? recipes.find(r => r.id === recipeId) : null;
    
    document.getElementById('form-title').textContent = recipe ? 'Rezept bearbeiten' : 'Neues Rezept';
    recipeForm.reset();
    
    // Formular mit Rezeptdaten füllen wenn vorhanden
    if (recipe) {
        document.getElementById('recipe-name').value = recipe.name;
        document.getElementById('recipe-description').value = recipe.description;
        document.getElementById('recipe-category').value = recipe.category;
        document.getElementById('recipe-prep-time').value = recipe.prepTime;
        document.getElementById('recipe-servings').value = recipe.servings;
        document.getElementById('recipe-difficulty').value = recipe.difficulty;
        document.getElementById('recipe-image').value = recipe.imageUrl;
        
        // Zutaten
        ingredientsList.innerHTML = '';
        recipe.ingredients.forEach(ing => {
            ingredientsList.appendChild(createIngredientRow(ing));
        });
        
        // Anweisungen
        instructionsList.innerHTML = '';
        recipe.instructions.forEach(inst => {
            instructionsList.appendChild(createInstructionRow(inst));
        });
    } else {
        ingredientsList.innerHTML = '';
        instructionsList.innerHTML = '';
        ingredientsList.appendChild(createIngredientRow());
        instructionsList.appendChild(createInstructionRow());
    }
    
    recipeFormModal.style.display = 'block';
}

// Formular schließen
function closeRecipeForm() {
    recipeFormModal.style.display = 'none';
    editingRecipeId = null;
}

// Event Listeners
addRecipeBtn.addEventListener('click', () => openRecipeForm());

addIngredientBtn.addEventListener('click', () => {
    ingredientsList.appendChild(createIngredientRow());
});

addInstructionBtn.addEventListener('click', () => {
    instructionsList.appendChild(createInstructionRow());
});

recipeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Zutaten sammeln
    const ingredients = Array.from(ingredientsList.children).map(row => {
        const [name, amount, unit] = row.querySelectorAll('input');
        return new Ingredient(name.value, Number(amount.value), unit.value);
    });
    
    // Anweisungen sammeln
    const instructions = Array.from(instructionsList.children).map(row => {
        return row.querySelector('input').value;
    });
    
    const recipeData = {
        id: editingRecipeId || Date.now().toString(),
        name: document.getElementById('recipe-name').value,
        description: document.getElementById('recipe-description').value,
        category: document.getElementById('recipe-category').value,
        prepTime: Number(document.getElementById('recipe-prep-time').value),
        servings: Number(document.getElementById('recipe-servings').value),
        difficulty: document.getElementById('recipe-difficulty').value,
        imageUrl: document.getElementById('recipe-image').value,
        ingredients,
        instructions
    };
    
    if (editingRecipeId) {
        // Bestehendes Rezept aktualisieren
        const index = recipes.findIndex(r => r.id === editingRecipeId);
        recipes[index] = new Recipe(
            recipeData.id,
            recipeData.name,
            recipeData.description,
            recipeData.ingredients,
            recipeData.instructions,
            recipeData.prepTime,
            recipeData.servings,
            recipeData.imageUrl
        );
        recipes[index].difficulty = recipeData.difficulty;
        recipes[index].category = recipeData.category;
    } else {
        // Neues Rezept hinzufügen
        const newRecipe = new Recipe(
            recipeData.id,
            recipeData.name,
            recipeData.description,
            recipeData.ingredients,
            recipeData.instructions,
            recipeData.prepTime,
            recipeData.servings,
            recipeData.imageUrl
        );
        newRecipe.difficulty = recipeData.difficulty;
        newRecipe.category = recipeData.category;
        recipes.push(newRecipe);
    }
    
    renderRecipes();
    closeRecipeForm();
});

// Füge closeRecipeForm zum window-Objekt hinzu
window.closeRecipeForm = closeRecipeForm;

// Initial render
renderRecipes();
renderShoppingList();