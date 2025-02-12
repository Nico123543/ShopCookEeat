class ShoppingList {
  constructor() {
    // Lade gespeicherte Items beim Erstellen der Liste
    const savedItems = localStorage.getItem('shoppingList');
    this.items = savedItems ? JSON.parse(savedItems) : [];
  }

  addItem(name, amount = '', unit = '') {
    this.items.push({
      id: Date.now().toString(),
      name,
      amount,
      unit,
      checked: false
    });
    this.save();
  }

  toggleItem(id) {
    const item = this.items.find(item => item.id === id);
    if (item) {
      item.checked = !item.checked;
      this.save();
    }
  }

  deleteItem(id) {
    this.items = this.items.filter(item => item.id !== id);
    this.save();
  }

  // Speichern der Liste im localStorage
  save() {
    localStorage.setItem('shoppingList', JSON.stringify(this.items));
  }
}

export default ShoppingList; 