const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    libelle: { type: String, required: true }, // ex: "Domicile", "Bureau"
    adresse: { type: String, required: true },
    ville: { type: String, required: true },
    codePostal: { type: String },
    telephone: { type: String },
    parDefaut: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Address', addressSchema);
