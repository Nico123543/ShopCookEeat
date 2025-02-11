import ShoppingList from '../models/shoppingList.js';

// Singleton-Instanz der ShoppingList
const shoppingList = new ShoppingList();

// Hilfsfunktionen
function addItems(ingredients) {
    ingredients.forEach(ingredient => {
        // Generiere eine eindeutige ID für jede Zutat
        const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        
        // Füge die Zutat mit der gleichen Struktur wie manuelle Einträge hinzu
        shoppingList.items.push({
            id: id,
            name: ingredient.name,
            amount: ingredient.amount,
            unit: ingredient.unit,
            checked: false
        });
    });
    // Speichere die aktualisierte Liste
    shoppingList.save();
}

function getItems() {
    return shoppingList.items;
}

function toggleItem(id) {
    shoppingList.toggleItem(id);
}

function deleteItem(id) {
    shoppingList.deleteItem(id);
}

// Exportiere die Funktionen und das shoppingList-Objekt
export {
    addItems,
    getItems,
    toggleItem,
    deleteItem,
    shoppingList as default
}; 