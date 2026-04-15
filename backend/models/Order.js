const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            nom: String,
            quantite: Number,
            prix: Number
        }
    ],
    total: { type: Number, required: true },
    statut: { type: String, default: 'En attente' }, // Pour le suivi de commande
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);