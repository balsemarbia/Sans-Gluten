const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
    type: { type: String, enum: ['product', 'recipe'], required: true },
    createdAt: { type: Date, default: Date.now }
});

// Compound index pour éviter les doublons
favoriteSchema.index({ userId: 1, itemId: 1, type: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
