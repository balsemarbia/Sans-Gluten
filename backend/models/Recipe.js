const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    titre: { type: String, required: true },
    description: { type: String },
    image: { type: String, default: 'https://via.placeholder.com/500' },
    temps: { type: String, required: true }, // ex: "30 min"
    difficulte: { type: String, enum: ['Facile', 'Moyen', 'Difficile'], default: 'Facile' },
    ingredients: [{ type: String }],
    instructions: { type: String, required: true },
    portions: { type: Number, default: 4 },
    categorie: { type: String, enum: ['Petit-déjeuner', 'Déjeuner', 'Dîner', 'Dessert', 'Snack'], default: 'Déjeuner' },
    createur: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    actif: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recipe', recipeSchema);
