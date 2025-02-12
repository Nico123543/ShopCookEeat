import sqlite3 from 'sqlite3';
import { recipes } from '../data/sample-recipes.js';

const db = new sqlite3.Database('src/db/recipes.db');

// Tabellen erstellen
function initDatabase() {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // Recipes Tabelle
            db.run(`
                CREATE TABLE IF NOT EXISTS recipes (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    description TEXT,
                    prepTime INTEGER,
                    servings INTEGER,
                    difficulty TEXT,
                    category TEXT,
                    imageUrl TEXT
                )
            `);

            // Ingredients Tabelle
            db.run(`
                CREATE TABLE IF NOT EXISTS ingredients (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    recipeId TEXT,
                    name TEXT NOT NULL,
                    amount REAL,
                    unit TEXT,
                    FOREIGN KEY (recipeId) REFERENCES recipes(id)
                )
            `);

            // Instructions Tabelle
            db.run(`
                CREATE TABLE IF NOT EXISTS instructions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    recipeId TEXT,
                    stepNumber INTEGER,
                    instruction TEXT NOT NULL,
                    FOREIGN KEY (recipeId) REFERENCES recipes(id)
                )
            `);

            // Zusätzliche Tabellen für erweiterte Funktionalität
            db.run(`
                CREATE TABLE IF NOT EXISTS favorites (
                    userId TEXT,
                    recipeId TEXT,
                    PRIMARY KEY (userId, recipeId),
                    FOREIGN KEY (recipeId) REFERENCES recipes(id)
                )
            `);

            db.run(`
                CREATE TABLE IF NOT EXISTS ratings (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    recipeId TEXT,
                    userId TEXT,
                    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
                    comment TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (recipeId) REFERENCES recipes(id)
                )
            `);
            resolve();
        });
    });
}

// Beispieldaten einfügen
function insertSampleData() {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // Lösche vorhandene Daten
            db.run('DELETE FROM instructions');
            db.run('DELETE FROM ingredients');
            db.run('DELETE FROM recipes');

            recipes.forEach(recipe => {
                // Füge Rezept ein
                db.run(
                    `INSERT INTO recipes (id, name, description, prepTime, servings, difficulty, category, imageUrl)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [recipe.id, recipe.name, recipe.description, recipe.prepTime, recipe.servings, 
                     recipe.difficulty, recipe.category, recipe.imageUrl]
                );

                // Füge Zutaten ein
                recipe.ingredients.forEach(ing => {
                    db.run(
                        `INSERT INTO ingredients (recipeId, name, amount, unit)
                         VALUES (?, ?, ?, ?)`,
                        [recipe.id, ing.name, ing.amount, ing.unit]
                    );
                });

                // Füge Anweisungen ein
                recipe.instructions.forEach((inst, index) => {
                    db.run(
                        `INSERT INTO instructions (recipeId, stepNumber, instruction)
                         VALUES (?, ?, ?)`,
                        [recipe.id, index + 1, inst]
                    );
                });
            });
            resolve();
        });
    });
}

// Datenbank initialisieren
console.log('Initialisiere Datenbank...');
initDatabase()
    .then(() => {
        console.log('Füge Beispieldaten ein...');
        return insertSampleData();
    })
    .then(() => {
        console.log('Datenbankinitialisierung abgeschlossen!');
        db.close();
    })
    .catch(error => {
        console.error('Fehler bei der Datenbankinitialisierung:', error);
        db.close();
    }); 