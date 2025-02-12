import ShoppingList from '../models/shoppingList.js';

// Erstelle und exportiere die shoppingList-Instanz
export const shoppingList = new ShoppingList();

// Exportiere die renderShoppingList Funktion
export function renderShoppingList() {
    const shoppingItems = document.getElementById('shopping-items');
    if (shoppingItems) {
        shoppingItems.innerHTML = shoppingList.items.map(item => `
            <li>
                <input type="checkbox" ${item.checked ? 'checked' : ''} 
                       onchange="toggleItem('${item.id}')">
                <span>${item.amount} ${item.unit} ${item.name}</span>
            </li>
        `).join('');
    }
} 