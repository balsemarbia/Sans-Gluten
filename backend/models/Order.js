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
    subtotal: { type: Number, required: true },
    shippingCost: { type: Number, default: 0 },
    coupon: {
        code: String,
        discount: Number
    },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    statut: { type: String, default: 'En attente' },
    adresse: {
        nom: String,
        rue: String,
        ville: String,
        codePostal: String,
        telephone: String
    },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);