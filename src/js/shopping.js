import shoppingList, { getItems, toggleItem, deleteItem } from './shoppingService.js';

// DOM Elements
const shoppingItems = document.getElementById('shopping-items');
const addItemForm = document.getElementById('add-item-form');

// Render shopping list
function renderShoppingList() {
    shoppingItems.innerHTML = shoppingList.items.map(item => `
        <li class="flex items-center gap-4 p-2 hover:bg-gray-50">
            <input type="checkbox" ${item.checked ? 'checked' : ''} 
                   onclick="window.handleToggleItem('${item.id}')"
                   class="h-5 w-5 text-green-600">
            <span class="${item.checked ? 'line-through text-gray-500' : ''}">
                ${item.name}
                ${item.amount || item.unit ? `(${item.amount} ${item.unit})`.trim() : ''}
            </span>
            <button onclick="window.handleDeleteItem('${item.id}')"
                    class="ml-auto text-red-500 hover:text-red-700">
                ×
            </button>
        </li>
    `).join('');
}

// Event Listeners
addItemForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('item-name').value;
    const amount = document.getElementById('item-amount').value || '';  // Optional
    const unit = document.getElementById('item-unit').value || '';      // Optional
    
    shoppingList.addItem(name, amount, unit);
    renderShoppingList();
    addItemForm.reset();
});

// Globale Funktionen für Event Handler
window.handleToggleItem = (id) => {
    toggleItem(id);
    renderShoppingList();
};

window.handleDeleteItem = (id) => {
    deleteItem(id);
    renderShoppingList();
};

// Initial render
renderShoppingList(); 