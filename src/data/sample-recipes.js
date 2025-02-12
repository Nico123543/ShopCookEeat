import { Recipe, Ingredient } from '../models/recipe.js';

// Beispiel-Rezepte
export const recipes = [
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
        'https://placehold.co/600x400/e2e8f0/64748b?text=Spaghetti+Bolognese'
    ),
    new Recipe(
        '2',
        'Caesar Salat',
        'Knackiger Salat mit cremigem Dressing und Croûtons',
        [
            new Ingredient('Römersalat', 1, 'Kopf'),
            new Ingredient('Parmesan', 50, 'g'),
            new Ingredient('Croûtons', 100, 'g'),
            new Ingredient('Hühnerbrustfilet', 200, 'g'),
            new Ingredient('Eigelb', 1, 'Stück')
        ],
        [
            'Salat waschen und in mundgerechte Stücke zerteilen',
            'Hühnerbrust grillen und in Streifen schneiden',
            'Dressing aus Eigelb, Senf, Zitrone und Öl zubereiten',
            'Alle Zutaten vermengen',
            'Mit Parmesan und Croûtons garnieren'
        ],
        20,
        2,
        'https://placehold.co/600x400/e2e8f0/64748b?text=Caesar+Salat'
    ),
    new Recipe(
        '3',
        'Tiramisu',
        'Italienisches Dessert mit Mascarpone und Kaffee',
        [
            new Ingredient('Mascarpone', 500, 'g'),
            new Ingredient('Löffelbiskuits', 200, 'g'),
            new Ingredient('Espresso', 200, 'ml'),
            new Ingredient('Eigelb', 4, 'Stück'),
            new Ingredient('Kakaopulver', 30, 'g')
        ],
        [
            'Espresso zubereiten und abkühlen lassen',
            'Eigelb mit Zucker schaumig schlagen',
            'Mascarpone unterheben',
            'Biskuits in Kaffee tauchen und schichten',
            'Mit Kakao bestäuben und kühlen'
        ],
        30,
        8,
        'https://placehold.co/600x400/e2e8f0/64748b?text=Tiramisu'
    ),
    new Recipe(
        '4',
        'Kartoffelsuppe',
        'Herzhafte Suppe mit Würstchen',
        [
            new Ingredient('Kartoffeln', 800, 'g'),
            new Ingredient('Möhren', 200, 'g'),
            new Ingredient('Lauch', 1, 'Stange'),
            new Ingredient('Wiener Würstchen', 4, 'Stück'),
            new Ingredient('Gemüsebrühe', 1, 'l')
        ],
        [
            'Gemüse schälen und würfeln',
            'In Brühe kochen bis alles weich ist',
            'Teilweise pürieren',
            'Würstchen in Scheiben schneiden',
            'Mit Petersilie garnieren'
        ],
        45,
        4,
        'https://placehold.co/600x400/e2e8f0/64748b?text=Kartoffelsuppe'
    ),
    new Recipe(
        '5',
        'Gemüse-Quiche',
        'Französische Tarteform mit buntem Gemüse',
        [
            new Ingredient('Mürbeteig', 1, 'Packung'),
            new Ingredient('Zucchini', 1, 'Stück'),
            new Ingredient('Paprika', 2, 'Stück'),
            new Ingredient('Eier', 3, 'Stück'),
            new Ingredient('Sahne', 200, 'ml')
        ],
        [
            'Teig ausrollen und Form belegen',
            'Gemüse in Scheiben schneiden',
            'Eiermischung vorbereiten',
            'Gemüse verteilen und übergießen',
            'Bei 180°C 35 Minuten backen'
        ],
        60,
        6,
        'https://placehold.co/600x400/e2e8f0/64748b?text=Gemüse+Quiche'
    ),
    new Recipe(
        '6',
        'Apfelstrudel',
        'Österreichische Dessertspezialität',
        [
            new Ingredient('Äpfel', 1000, 'g'),
            new Ingredient('Strudelteig', 1, 'Packung'),
            new Ingredient('Rosinen', 100, 'g'),
            new Ingredient('Zimt', 2, 'TL'),
            new Ingredient('Butter', 100, 'g')
        ],
        [
            'Äpfel schälen und in Spalten schneiden',
            'Mit Zimt und Rosinen mischen',
            'Teig ausrollen und füllen',
            'Einrollen und mit Butter bestreichen',
            'Bei 180°C goldbraun backen'
        ],
        90,
        8,
        'https://placehold.co/600x400/e2e8f0/64748b?text=Apfelstrudel'
    ),
    new Recipe(
        '7',
        'Tomatensuppe',
        'Cremige Suppe mit frischen Tomaten',
        [
            new Ingredient('Tomaten', 1000, 'g'),
            new Ingredient('Zwiebeln', 2, 'Stück'),
            new Ingredient('Sahne', 100, 'ml'),
            new Ingredient('Basilikum', 1, 'Bund'),
            new Ingredient('Knoblauch', 2, 'Zehen')
        ],
        [
            'Tomaten würfeln',
            'Zwiebeln und Knoblauch anschwitzen',
            'Tomaten dazugeben und köcheln lassen',
            'Pürieren und Sahne einrühren',
            'Mit Basilikum garnieren'
        ],
        35,
        4,
        'https://placehold.co/600x400/e2e8f0/64748b?text=Tomatensuppe'
    ),
    new Recipe(
        '8',
        'Griechischer Salat',
        'Frischer Salat mit Feta und Oliven',
        [
            new Ingredient('Tomaten', 4, 'Stück'),
            new Ingredient('Gurke', 1, 'Stück'),
            new Ingredient('Feta', 200, 'g'),
            new Ingredient('Oliven', 100, 'g'),
            new Ingredient('Zwiebeln', 1, 'Stück')
        ],
        [
            'Gemüse in grobe Stücke schneiden',
            'Feta würfeln',
            'Alles in einer Schüssel mischen',
            'Mit Olivenöl und Oregano würzen',
            'Oliven darüber verteilen'
        ],
        15,
        4,
        'https://placehold.co/600x400/e2e8f0/64748b?text=Griechischer+Salat'
    ),
    new Recipe(
        '9',
        'Schokoladen-Mousse',
        'Luftiges Dessert für Schokofans',
        [
            new Ingredient('Zartbitterschokolade', 200, 'g'),
            new Ingredient('Sahne', 400, 'ml'),
            new Ingredient('Eier', 3, 'Stück'),
            new Ingredient('Zucker', 50, 'g'),
            new Ingredient('Vanillezucker', 1, 'Päckchen')
        ],
        [
            'Schokolade schmelzen',
            'Eigelb mit Zucker schaumig schlagen',
            'Sahne steif schlagen',
            'Alles vorsichtig vermengen',
            'Mindestens 3 Stunden kühlen'
        ],
        30,
        6,
        'https://placehold.co/600x400/e2e8f0/64748b?text=Schokoladen+Mousse'
    ),
    new Recipe(
        '10',
        'Kürbissuppe',
        'Cremige Herbstsuppe mit Ingwer',
        [
            new Ingredient('Hokkaido-Kürbis', 1, 'Stück'),
            new Ingredient('Kartoffeln', 200, 'g'),
            new Ingredient('Ingwer', 20, 'g'),
            new Ingredient('Kokosmilch', 400, 'ml'),
            new Ingredient('Curry', 1, 'TL')
        ],
        [
            'Kürbis und Kartoffeln würfeln',
            'Ingwer fein hacken',
            'Alles zusammen köcheln lassen',
            'Pürieren und Kokosmilch zugeben',
            'Mit Kürbiskernen garnieren'
        ],
        40,
        4,
        'https://placehold.co/600x400/e2e8f0/64748b?text=Kürbissuppe'
    )
];

// Kategorien setzen
recipes[0].category = 'Hauptgericht';
recipes[1].category = 'Salat';
recipes[2].category = 'Dessert';
recipes[3].category = 'Hauptgericht';
recipes[4].category = 'Hauptgericht';
recipes[5].category = 'Dessert';
recipes[6].category = 'Vorspeise';
recipes[7].category = 'Salat';
recipes[8].category = 'Dessert';
recipes[9].category = 'Vorspeise';

// Schwierigkeitsgrade setzen
recipes[0].difficulty = 'mittel';
recipes[1].difficulty = 'leicht';
recipes[2].difficulty = 'mittel';
recipes[3].difficulty = 'leicht';
recipes[4].difficulty = 'mittel';
recipes[5].difficulty = 'schwer';
recipes[6].difficulty = 'leicht';
recipes[7].difficulty = 'leicht';
recipes[8].difficulty = 'schwer';
recipes[9].difficulty = 'mittel'; 