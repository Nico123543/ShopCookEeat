import { Recipe, Ingredient } from '../models/recipe.js';
import shoppingList, { addItems } from './shoppingService.js';
import { recipes } from '../data/sample-recipes.js';

// DOM Elements
const recipeList = document.getElementById('recipe-list');
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
const searchInput = document.getElementById('recipe-search');
const cookingModal = document.getElementById('cooking-modal');
const startCookingBtn = document.getElementById('start-cooking');
const prevStepBtn = document.getElementById('prev-step');
const nextStepBtn = document.getElementById('next-step');
const stepCounter = document.getElementById('step-counter');
const currentStepText = document.getElementById('current-step');
const cookingIngredients = document.getElementById('cooking-ingredients');
const timerMinutes = document.getElementById('timer-minutes');
const startTimerBtn = document.getElementById('start-timer');
const timerDisplay = document.getElementById('timer-display');

let editingRecipeId = null;
let currentRecipe = null;

// Kochansicht-Variablen
let currentStepIndex = 0;
let timerInterval = null;

// Timer-Verwaltung
class Timer {
    constructor(minutes, onTick, onComplete) {
        this.totalSeconds = minutes * 60;
        this.remainingSeconds = this.totalSeconds;
        this.isRunning = false;
        this.interval = null;
        this.onTick = onTick;
        this.onComplete = onComplete;
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.interval = setInterval(() => {
                this.remainingSeconds--;
                this.onTick(this.formatTime());
                
                if (this.remainingSeconds <= 0) {
                    this.stop();
                    this.onComplete();
                }
            }, 1000);
        }
    }

    pause() {
        if (this.isRunning) {
            clearInterval(this.interval);
            this.isRunning = false;
        }
    }

    resume() {
        if (!this.isRunning && this.remainingSeconds > 0) {
            this.start();
        }
    }

    stop() {
        clearInterval(this.interval);
        this.isRunning = false;
    }

    reset() {
        this.stop();
        this.remainingSeconds = this.totalSeconds;
        this.onTick(this.formatTime());
    }

    formatTime() {
        const minutes = Math.floor(this.remainingSeconds / 60);
        const seconds = this.remainingSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

// Kochansicht initialisieren
function initCookingView(recipe) {
    currentRecipe = recipe;
    currentStepIndex = 0;
    
    // Titel setzen
    cookingModal.querySelector('h2').textContent = recipe.name;
    
    // Zutaten anzeigen
    cookingIngredients.innerHTML = recipe.ingredients.map(ing => `
        <li class="flex items-center gap-2">
            <input type="checkbox" class="h-5 w-5">
            <span>${ing.amount} ${ing.unit} ${ing.name}</span>
        </li>
    `).join('');
    
    updateStep();
    cookingModal.style.display = 'block';
}

// Aktuellen Schritt aktualisieren
function updateStep() {
    stepCounter.textContent = `Schritt ${currentStepIndex + 1} von ${currentRecipe.instructions.length}`;
    currentStepText.textContent = currentRecipe.instructions[currentStepIndex];
    
    // Button-Status aktualisieren
    prevStepBtn.disabled = currentStepIndex === 0;
    nextStepBtn.disabled = currentStepIndex === currentRecipe.instructions.length - 1;
    
    prevStepBtn.style.opacity = prevStepBtn.disabled ? '0.5' : '1';
    nextStepBtn.style.opacity = nextStepBtn.disabled ? '0.5' : '1';
}

// Timer-Funktionalität im Kochansicht-Modal
function initializeTimer() {
    const timerDisplay = document.getElementById('timer-display');
    const startTimerBtn = document.getElementById('start-timer');
    const timerMinutes = document.getElementById('timer-minutes');
    const resetTimerBtn = document.createElement('button'); // Neuer Reset-Button
    let currentTimer = null;

    // Reset-Button konfigurieren
    resetTimerBtn.textContent = 'Timer zurücksetzen';
    resetTimerBtn.className = 'px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 ml-2';
    resetTimerBtn.style.display = 'none';
    startTimerBtn.parentNode.insertBefore(resetTimerBtn, startTimerBtn.nextSibling);

    startTimerBtn.addEventListener('click', () => {
        const minutes = parseInt(timerMinutes.value);
        if (!minutes || minutes <= 0) {
            alert('Bitte geben Sie eine gültige Zeit ein');
            return;
        }

        if (currentTimer) {
            currentTimer.stop();
        }

        timerDisplay.classList.remove('hidden');
        startTimerBtn.textContent = 'Timer läuft...';
        startTimerBtn.disabled = true;
        resetTimerBtn.style.display = 'inline-block'; // Reset-Button anzeigen

        currentTimer = new Timer(
            minutes,
            (timeString) => {
                timerDisplay.textContent = timeString;
            },
            () => {
                // Timer abgelaufen
                new Audio('data:audio/wav;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7xA4Tvh9Rz/y8QADBwMWgQAZG/ILNAARQ4GLTcDeIIIhxGOBAuD7hOfBB3/94gcJ3w+o5/5eIAIAAAVwWgQAVQ2ORaIQwEMAJiDg95G4nQL7mQVWI6GwRcfsZAcsKkJvxgxEjzFUgfHoSQ9Qq7KNwqHwuB13MA4a1q/DmBrHgPcmjiGoh//EwC5nGPEmS4RcfkVKOhJf+WOgoxJclFz3kgn//dBA+ya1GhurNn8zb//9NNutNuhz31f////9vt///z+IdAEAAAK4LQIAKobHItEIYCGAExBwe8jcToF9zIKrEdDYIuP2MgOWFSE34wYiR5iqQPj0JIeoVdlG4VD4XA67mAcNa1fhzA1jwHuTRxDUQ//iYBczjHiTJcIuPyKlHQkv/LHQUYkuSi57yQT//uggfZNajQ3Vmz+Zt//+mm3Wm3Q576v////+32///5/EOgAAADVghQAAAAA==').play();
                alert('Timer abgelaufen!');
                startTimerBtn.textContent = 'Timer starten';
                startTimerBtn.disabled = false;
                resetTimerBtn.style.display = 'none'; // Reset-Button ausblenden
                timerMinutes.value = '';
            }
        );

        currentTimer.start();

        // Pause/Resume Funktionalität
        timerDisplay.addEventListener('click', () => {
            if (currentTimer.isRunning) {
                currentTimer.pause();
                timerDisplay.classList.add('paused');
                startTimerBtn.textContent = 'Timer fortsetzen';
                startTimerBtn.disabled = false;
            } else {
                currentTimer.resume();
                timerDisplay.classList.remove('paused');
                startTimerBtn.textContent = 'Timer läuft...';
                startTimerBtn.disabled = true;
            }
        });
    });

    // Reset-Button Event Listener
    resetTimerBtn.addEventListener('click', () => {
        if (currentTimer) {
            currentTimer.reset();
            currentTimer.stop();
            timerDisplay.classList.remove('paused');
            startTimerBtn.textContent = 'Timer starten';
            startTimerBtn.disabled = false;
            resetTimerBtn.style.display = 'none';
            timerMinutes.value = '';
            timerDisplay.classList.add('hidden');
        }
    });

    // Timer zurücksetzen beim Schließen des Modals
    cookingModal.querySelector('.close').addEventListener('click', () => {
        if (currentTimer) {
            currentTimer.stop();
        }
        timerDisplay.classList.add('hidden');
        startTimerBtn.textContent = 'Timer starten';
        startTimerBtn.disabled = false;
        resetTimerBtn.style.display = 'none'; // Reset-Button ausblenden
        timerMinutes.value = '';
    });
}

// Timer-Styles
const timerStyles = document.createElement('style');
timerStyles.textContent = `
    #timer-display {
        cursor: pointer;
        padding: 1rem;
        background: #f3f4f6;
        border-radius: 0.5rem;
        font-size: 2rem;
        font-weight: bold;
        text-align: center;
        transition: background-color 0.2s;
    }
    #timer-display.paused {
        background: #fee2e2;
    }
    #timer-display:hover {
        background: #e5e7eb;
    }
`;
document.head.appendChild(timerStyles);

// Initialisiere Timer beim Laden der Seite
document.addEventListener('DOMContentLoaded', initializeTimer);

// Event Listeners für die Kochansicht
startCookingBtn.addEventListener('click', () => {
    const recipeId = currentRecipe.id;
    initCookingView(currentRecipe);
    recipeModal.style.display = 'none';
});

prevStepBtn.addEventListener('click', () => {
    if (currentStepIndex > 0) {
        currentStepIndex--;
        updateStep();
    }
});

nextStepBtn.addEventListener('click', () => {
    if (currentStepIndex < currentRecipe.instructions.length - 1) {
        currentStepIndex++;
        updateStep();
    }
});

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

// Rezepte anzeigen
function renderRecipes(filteredRecipes = recipes) {
    if (filteredRecipes.length === 0) {
        recipeList.innerHTML = `
            <div class="col-span-full text-center py-8">
                <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-gray-500 text-lg">Keine Rezepte gefunden</p>
                <p class="text-gray-400">Versuchen Sie es mit anderen Suchbegriffen</p>
            </div>
        `;
        return;
    }

    recipeList.innerHTML = filteredRecipes.map(recipe => `
        <div class="recipe-card cursor-pointer" onclick="showRecipeDetail('${recipe.id}')">
            ${recipe.imageUrl ? `<img src="${recipe.imageUrl}" alt="${recipe.name}">` : ''}
            <div class="recipe-info">
                <h2 class="text-xl font-bold mb-2">${recipe.name}</h2>
                <p class="text-gray-600 mb-4">${recipe.description}</p>
                <div class="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span>🕒 ${recipe.prepTime} Min</span>
                    <span>👥 ${recipe.servings} Portionen</span>
                </div>
                <div class="flex gap-2">
                    <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        ${recipe.difficulty}
                    </span>
                    ${recipe.category ? `
                        <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            ${recipe.category}
                        </span>
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// Rezeptformular öffnen
function openRecipeForm(recipeId = null) {
    editingRecipeId = recipeId;
    const recipe = recipeId ? recipes.find(r => r.id === recipeId) : null;
    
    document.getElementById('form-title').textContent = recipe ? 'Rezept bearbeiten' : 'Neues Rezept';
    recipeForm.reset();
    
    if (recipe) {
        document.getElementById('recipe-name').value = recipe.name;
        document.getElementById('recipe-description').value = recipe.description;
        document.getElementById('recipe-category').value = recipe.category;
        document.getElementById('recipe-prep-time').value = recipe.prepTime;
        document.getElementById('recipe-servings').value = recipe.servings;
        document.getElementById('recipe-difficulty').value = recipe.difficulty;
        document.getElementById('recipe-image').value = recipe.imageUrl;
        
        ingredientsList.innerHTML = '';
        recipe.ingredients.forEach(ing => {
            ingredientsList.appendChild(createIngredientRow(ing));
        });
        
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
    searchInput.value = '';
    renderRecipes();
}

// Event Listeners
addRecipeBtn.addEventListener('click', () => openRecipeForm());

addIngredientBtn.addEventListener('click', () => {
    ingredientsList.appendChild(createIngredientRow());
});

addInstructionBtn.addEventListener('click', () => {
    instructionsList.appendChild(createInstructionRow());
});

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

// Rezeptformular absenden
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
window.openRecipeForm = openRecipeForm;

// Bestehende searchRecipes Funktion verbessern
function searchRecipes(query, category) {
    const filteredRecipes = recipes.filter(recipe => {
        const matchesQuery = !query || 
            recipe.name.toLowerCase().includes(query.toLowerCase()) ||
            recipe.description.toLowerCase().includes(query.toLowerCase()) ||
            recipe.ingredients.some(ing => 
                ing.name.toLowerCase().includes(query.toLowerCase())
            );
            
        const matchesCategory = !category || recipe.category === category;
        
        return matchesQuery && matchesCategory;
    });
    
    renderRecipes(filteredRecipes);
}

// Event Listener für die Suche
searchInput.addEventListener('input', (e) => {
    const query = e.target.value;
    const category = categoryFilter.value;
    searchRecipes(query, category);
});

categoryFilter.addEventListener('change', (e) => {
    const category = e.target.value;
    const query = searchInput.value;
    searchRecipes(query, category);
});

// Initial render
searchRecipes('', '');

// Rezeptdetails anzeigen
function showRecipeDetail(recipeId) {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return;
    
    currentRecipe = recipe;

    // Verstecke die Suchleiste und Filter
    document.querySelector('.bg-white.rounded-lg.shadow').style.display = 'none';
    
    // Leere die Rezeptliste und zeige nur das ausgewählte Rezept
    recipeList.innerHTML = `
        <div class="col-span-full">
            <div class="bg-white rounded-lg shadow">
                <div class="p-6">
                    <div class="text-center mb-8">
                        <h2 class="text-3xl font-serif mb-2">${recipe.name}</h2>
                        <p class="text-gray-600 italic">${recipe.description}</p>
                    </div>

                    ${recipe.imageUrl ? `
                        <div class="mb-8 rounded-lg overflow-hidden">
                            <img src="${recipe.imageUrl}" alt="${recipe.name}" 
                                 class="w-full h-64 object-cover">
                        </div>
                    ` : ''}

                    <div class="grid md:grid-cols-2 gap-8 mb-8">
                        <div class="bg-green-50 p-6 rounded-lg">
                            <h3 class="text-xl font-serif mb-4 text-green-800">Informationen</h3>
                            <ul class="space-y-2 text-green-700">
                                <li class="flex items-center gap-2">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Zubereitungszeit: ${recipe.prepTime} Minuten
                                </li>
                                <li class="flex items-center gap-2">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <div class="flex items-center gap-2">
                                        <span>Portionen:</span>
                                        <input type="number" 
                                               value="${recipe.servings}" 
                                               min="1" 
                                               class="w-16 px-2 py-1 border rounded text-center"
                                               onchange="window.updateServings('${recipe.id}', this.value)">
                                    </div>
                                </li>
                                <li class="flex items-center gap-2">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    Schwierigkeit: ${recipe.difficulty}
                                </li>
                                <li class="flex items-center gap-2">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                    Kategorie: ${recipe.category}
                                </li>
                            </ul>
                        </div>

                        <div class="bg-amber-50 p-6 rounded-lg">
                            <h3 class="text-xl font-serif mb-4 text-amber-800">Zutaten</h3>
                            <ul class="space-y-2 text-amber-700" id="ingredients-list">
                                ${recipe.ingredients.map(ing => `
                                    <li class="flex justify-between items-center">
                                        <span>${ing.name}</span>
                                        <span class="font-medium">
                                            <span class="ingredient-amount" 
                                                  data-original="${ing.amount}" 
                                                  data-unit="${ing.unit}">
                                                ${ing.amount}
                                            </span> 
                                            ${ing.unit}
                                        </span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>

                    <div class="bg-gray-50 p-6 rounded-lg">
                        <h3 class="text-xl font-serif mb-4">Zubereitung</h3>
                        <ol class="space-y-4">
                            ${recipe.instructions.map((step, index) => `
                                <li class="flex gap-4">
                                    <span class="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                                        ${index + 1}
                                    </span>
                                    <p class="text-gray-700 leading-relaxed">${step}</p>
                                </li>
                            `).join('')}
                        </ol>
                    </div>
                </div>
                
                <div class="flex justify-between items-center gap-4 p-6 bg-gray-50 border-t">
                    <div class="flex gap-4">
                        <button id="start-cooking" 
                                class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                            Kochen starten
                        </button>
                        <button id="add-to-shopping-list"
                                class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            Zur Einkaufsliste hinzufügen
                        </button>
                    </div>
                    <button onclick="window.showAllRecipes()" 
                            class="px-4 py-2 text-green-600 hover:text-green-700 flex items-center gap-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        Zurück zur Übersicht
                    </button>
                </div>
            </div>
        </div>
    `;

    // Aktualisiere die Event Listener für die neuen Buttons
    document.getElementById('start-cooking').addEventListener('click', () => {
        initCookingView(currentRecipe);
    });
    
    document.getElementById('add-to-shopping-list').addEventListener('click', () => {
        addItems(currentRecipe.ingredients);
        
        // Zeige Bestätigung
        const notification = document.createElement('div');
        notification.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg';
        notification.textContent = 'Zutaten wurden zur Einkaufsliste hinzugefügt';
        document.body.appendChild(notification);
        
        // Entferne Benachrichtigung nach 3 Sekunden
        setTimeout(() => {
            notification.remove();
        }, 3000);
    });
}

// Funktion zum Zurückkehren zur Übersicht
window.showAllRecipes = () => {
    // Zeige die Suchleiste und Filter wieder an
    document.querySelector('.bg-white.rounded-lg.shadow').style.display = 'block';
    
    // Lade alle Rezepte neu
    searchRecipes(searchInput.value, categoryFilter.value);
};

// Verbesserter Portionsrechner mit Rundung
function updateServings(recipeId, newServings) {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return;

    newServings = parseInt(newServings);
    if (newServings < 1) {
        newServings = 1;
        document.querySelector('input[type="number"]').value = 1;
    }

    const ratio = newServings / recipe.servings;
    const ingredientAmounts = document.querySelectorAll('.ingredient-amount');
    
    ingredientAmounts.forEach(element => {
        const originalAmount = parseFloat(element.dataset.original);
        let newAmount = originalAmount * ratio;
        
        // Intelligente Rundung basierend auf der Menge
        if (newAmount >= 10) {
            newAmount = Math.round(newAmount);
        } else if (newAmount >= 1) {
            newAmount = Math.round(newAmount * 2) / 2; // Runde auf 0.5
        } else {
            newAmount = Math.round(newAmount * 4) / 4; // Runde auf 0.25
        }
        
        element.textContent = newAmount;
    });

    recipe.servings = newServings;
}

// Füge showRecipeDetail zum window-Objekt hinzu
window.showRecipeDetail = showRecipeDetail; 