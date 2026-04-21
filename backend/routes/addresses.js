const express = require('express');
const router = express.Router();
const Address = require('../models/Address');
const auth = require('../middleware/authMiddleware');

// ROUTE : Récupérer toutes les adresses d'un utilisateur
router.get('/', auth, async (req, res) => {
    try {
        const addresses = await Address.find({ userId: req.user.id }).sort({ parDefaut: -1, createdAt: -1 });
        res.json(addresses);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des adresses." });
    }
});

// ROUTE : Créer une adresse
router.post('/', auth, async (req, res) => {
    try {
        const { libelle, adresse, ville, codePostal, telephone, parDefaut } = req.body;

        if (!adresse || !ville) {
            return res.status(400).json({ message: "L'adresse et la ville sont obligatoires." });
        }

        // Si par défaut, retirer le défaut aux autres
        if (parDefaut) {
            await Address.updateMany({ userId: req.user.id }, { parDefaut: false });
        }

        const newAddress = new Address({
            userId: req.user.id,
            libelle: libelle || 'Domicile',
            adresse,
            ville,
            codePostal,
            telephone,
            parDefaut: parDefaut || false
        });

        await newAddress.save();
        res.status(201).json({ message: "Adresse créée !", address: newAddress });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création de l'adresse." });
    }
});

// ROUTE : Modifier une adresse
router.put('/:id', auth, async (req, res) => {
    try {
        const address = await Address.findOne({ _id: req.params.id, userId: req.user.id });

        if (!address) {
            return res.status(404).json({ message: "Adresse non trouvée." });
        }

        const { libelle, adresse, ville, codePostal, telephone, parDefaut } = req.body;

        // Si par défaut, retirer le défaut aux autres
        if (parDefaut) {
            await Address.updateMany({ userId: req.user.id, _id: { $ne: req.params.id } }, { parDefaut: false });
        }

        const updatedAddress = await Address.findByIdAndUpdate(
            req.params.id,
            { libelle, adresse, ville, codePostal, telephone, parDefaut },
            { new: true }
        );

        res.json({ message: "Adresse mise à jour !", address: updatedAddress });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la modification de l'adresse." });
    }
});

// ROUTE : Supprimer une adresse
router.delete('/:id', auth, async (req, res) => {
    try {
        const address = await Address.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

        if (!address) {
            return res.status(404).json({ message: "Adresse non trouvée." });
        }

        res.json({ message: "Adresse supprimée !" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression de l'adresse." });
    }
});

module.exports = router;
