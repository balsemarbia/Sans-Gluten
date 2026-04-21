const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    description: { type: String },
    prix: { type: Number, required: true },
    image: { type: String, default: 'https://via.placeholder.com/300' },
    categorie: { type: String, enum: ['Farines', 'Pains', 'Pâtisseries', 'Snacks', 'Autres'], default: 'Autres' },
    stock: { type: Number, default: 0 },
    ingredients: [{ type: String }],
    allergenes: [{ type: String }],
    certifieSansGluten: { type: Boolean, default: true },
    bio: { type: Boolean, default: false },
    actif: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
