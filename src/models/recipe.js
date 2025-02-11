class Recipe {
  constructor(id, name, description, ingredients, instructions, prepTime, servings, imageUrl = '') {
    this.id = id;
    this.name = name;
    this.description = description;
    this.ingredients = ingredients;
    this.instructions = instructions;
    this.prepTime = prepTime;
    this.servings = servings;
    this.imageUrl = imageUrl;
    this.difficulty = 'mittel'; // leicht, mittel, schwer
    this.category = ''; // z.B. Hauptgericht, Dessert, etc.
  }

  // Methode zum Hinzufügen aller Zutaten zur Einkaufsliste
  addToShoppingList(shoppingList) {
    this.ingredients.forEach(ingredient => {
      shoppingList.addItem(ingredient.name, ingredient.amount, ingredient.unit);
    });
  }
}

class Ingredient {
  constructor(name, amount, unit) {
    this.name = name;
    this.amount = amount;
    this.unit = unit;
  }
}

export { Recipe, Ingredient }; 