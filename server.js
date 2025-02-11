import express from 'express';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const db = new sqlite3.Database('src/db/recipes.db');

app.use(express.json());
app.use(express.static('src'));

// API Endpunkte
app.get('/api/recipes', (req, res) => {
    const { search, category } = req.query;
    
    let query = `
        SELECT r.*, 
            GROUP_CONCAT(DISTINCT i.name || '|' || i.amount || '|' || i.unit) as ingredients,
            GROUP_CONCAT(instruction) as instructions
        FROM recipes r
        LEFT JOIN ingredients i ON r.id = i.recipeId
        LEFT JOIN instructions inst ON r.id = inst.recipeId
    `;

    const params = [];
    if (search || category) {
        query += ' WHERE 1=1';
        if (search) {
            query += `
                AND (
                    LOWER(r.name) LIKE LOWER(?)
                    OR LOWER(r.description) LIKE LOWER(?)
                    OR LOWER(i.name) LIKE LOWER(?)
                    OR LOWER(inst.instruction) LIKE LOWER(?)
                )
            `;
            const searchParam = `%${search}%`;
            params.push(searchParam, searchParam, searchParam, searchParam);
        }
        if (category) {
            query += ' AND r.category = ?';
            params.push(category);
        }
    }
    
    query += ' GROUP BY r.id';

    db.all(query, params, (err, recipes) => {
        if (err) {
            console.error('Datenbankfehler:', err);
            return res.status(500).json({ error: err.message });
        }
        
        // Formatiere die Ergebnisse
        const formattedRecipes = recipes.map(recipe => ({
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients.split(',').map(ing => {
                const [name, amount, unit] = ing.split('|');
                return { name, amount: Number(amount), unit };
            }) : [],
            instructions: recipe.instructions ? recipe.instructions.split(',') : []
        }));

        res.json(formattedRecipes);
    });
});

// Weitere API Endpunkte für CRUD Operationen...
app.post('/api/recipes', (req, res) => {
    const recipe = req.body;
    // Implementation...
});

app.put('/api/recipes/:id', (req, res) => {
    const recipe = req.body;
    // Implementation...
});

app.delete('/api/recipes/:id', (req, res) => {
    // Implementation...
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
}); 