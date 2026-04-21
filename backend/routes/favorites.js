const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Favorite = require('../models/Favorite');
const auth = require('../middleware/authMiddleware');

// ROUTE : Récupérer tous les favoris d'un utilisateur
router.get('/', auth, async (req, res) => {
    try {
        const favorites = await Favorite.find({ userId: req.user.id })
            .sort({ createdAt: -1 });

        // Populate manuel pour gérer à la fois Product et Recipe
        const populatedFavorites = await Promise.all(
            favorites.map(async (fav) => {
                let populatedItem;
                if (fav.type === 'product') {
                    populatedItem = await mongoose.model('Product').findById(fav.itemId);
                } else if (fav.type === 'recipe') {
                    populatedItem = await mongoose.model('Recipe').findById(fav.itemId);
                }

                return {
                    _id: fav._id,
                    itemId: populatedItem,
                    type: fav.type,
                    createdAt: fav.createdAt
                };
            })
        );

        res.json(populatedFavorites.filter(fav => fav.itemId !== null));
    } catch (error) {
        console.error("Erreur get favoris:", error);
        res.status(500).json({ message: "Erreur lors de la récupération des favoris." });
    }
});

// ROUTE : Ajouter un favori
router.post('/', auth, async (req, res) => {
    try {
        const { itemId, type } = req.body;

        if (!itemId || !type) {
            return res.status(400).json({ message: "L'itemId et le type sont obligatoires." });
        }

        // Vérifier si déjà en favori
        const existing = await Favorite.findOne({ userId: req.user.id, itemId, type });

        if (existing) {
            return res.status(400).json({ message: "Déjà dans les favoris." });
        }

        const newFavorite = new Favorite({
            userId: req.user.id,
            itemId,
            type
        });

        await newFavorite.save();
        res.status(201).json({ message: "Ajouté aux favoris !", favorite: newFavorite });
    } catch (error) {
        console.error("Erreur ajout favori:", error);
        res.status(500).json({ message: "Erreur lors de l'ajout aux favoris." });
    }
});

// ROUTE : Supprimer un favori
router.delete('/:id', auth, async (req, res) => {
    try {
        const favorite = await Favorite.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!favorite) {
            return res.status(404).json({ message: "Favori non trouvé." });
        }

        res.json({ message: "Retiré des favoris !" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression du favori." });
    }
});

module.exports = router;
