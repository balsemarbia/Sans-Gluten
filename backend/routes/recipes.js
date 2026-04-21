const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const auth = require('../middleware/authMiddleware');

// ROUTE : Récupérer toutes les recettes (publique)
router.get('/', async (req, res) => {
    try {
        const { categorie, recherche } = req.query;
        let query = { actif: true };

        if (categorie) {
            query.categorie = categorie;
        }

        if (recherche) {
            query.$or = [
                { titre: { $regex: recherche, $options: 'i' } },
                { description: { $regex: recherche, $options: 'i' } },
                { ingredients: { $regex: recherche, $options: 'i' } }
            ];
        }

        const recipes = await Recipe.find(query).sort({ createdAt: -1 });
        res.json(recipes);
    } catch (error) {
        console.error("Erreur get recettes:", error);
        res.status(500).json({ message: "Erreur lors de la récupération des recettes." });
    }
});

// ROUTE : Récupérer une recette par ID
router.get('/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id).populate('createur', 'nom prenom');
        if (!recipe) {
            return res.status(404).json({ message: "Recette non trouvée." });
        }
        res.json(recipe);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération de la recette." });
    }
});

// ROUTE : Créer une recette (authentifié)
router.post('/', auth, async (req, res) => {
    try {
        const { titre, description, image, temps, difficulte, ingredients, instructions, portions, categorie } = req.body;

        if (!titre || !temps || !instructions) {
            return res.status(400).json({ message: "Le titre, le temps et les instructions sont obligatoires." });
        }

        const newRecipe = new Recipe({
            titre,
            description,
            image,
            temps,
            difficulte: difficulte || 'Facile',
            ingredients: ingredients || [],
            instructions,
            portions: portions || 4,
            categorie: categorie || 'Déjeuner',
            createur: req.user.id
        });

        const savedRecipe = await newRecipe.save();
        res.status(201).json({ message: "Recette créée avec succès !", recipe: savedRecipe });
    } catch (error) {
        console.error("Erreur création recette:", error);
        res.status(500).json({ message: "Erreur lors de la création de la recette." });
    }
});

// ROUTE : Modifier une recette
router.put('/:id', auth, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({ message: "Recette non trouvée." });
        }

        // Vérifier que l'utilisateur est le créateur
        if (recipe.createur.toString() !== req.user.id) {
            return res.status(403).json({ message: "Vous n'êtes pas autorisé à modifier cette recette." });
        }

        const { titre, description, image, temps, difficulte, ingredients, instructions, portions, categorie, actif } = req.body;

        const updatedRecipe = await Recipe.findByIdAndUpdate(
            req.params.id,
            { titre, description, image, temps, difficulte, ingredients, instructions, portions, categorie, actif },
            { new: true }
        );

        res.json({ message: "Recette mise à jour avec succès !", recipe: updatedRecipe });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la modification de la recette." });
    }
});

// ROUTE : Supprimer une recette
router.delete('/:id', auth, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({ message: "Recette non trouvée." });
        }

        // Vérifier que l'utilisateur est le créateur
        if (recipe.createur.toString() !== req.user.id) {
            return res.status(403).json({ message: "Vous n'êtes pas autorisé à supprimer cette recette." });
        }

        await Recipe.findByIdAndDelete(req.params.id);
        res.json({ message: "Recette supprimée avec succès !" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression de la recette." });
    }
});

module.exports = router;
