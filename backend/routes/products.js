const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/authMiddleware');

// ROUTE : Récupérer tous les produits (publique)
router.get('/', async (req, res) => {
    try {
        const { categorie, recherche } = req.query;
        let query = { actif: true };

        if (categorie) {
            query.categorie = categorie;
        }

        if (recherche) {
            query.$or = [
                { nom: { $regex: recherche, $options: 'i' } },
                { description: { $regex: recherche, $options: 'i' } }
            ];
        }

        const products = await Product.find(query).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        console.error("Erreur get produits:", error);
        res.status(500).json({ message: "Erreur lors de la récupération des produits." });
    }
});

// ROUTE : Récupérer un produit par ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Produit non trouvé." });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération du produit." });
    }
});

// ROUTE : Créer un produit (admin/authentifié)
router.post('/', auth, async (req, res) => {
    try {
        const { nom, description, prix, image, categorie, stock, ingredients, allergenes, certifieSansGluten, bio } = req.body;

        if (!nom || !prix) {
            return res.status(400).json({ message: "Le nom et le prix sont obligatoires." });
        }

        const newProduct = new Product({
            nom,
            description,
            prix,
            image,
            categorie,
            stock: stock || 0,
            ingredients: ingredients || [],
            allergenes: allergenes || [],
            certifieSansGluten: certifieSansGluten !== undefined ? certifieSansGluten : true,
            bio: bio || false
        });

        const savedProduct = await newProduct.save();
        res.status(201).json({ message: "Produit créé avec succès !", product: savedProduct });
    } catch (error) {
        console.error("Erreur création produit:", error);
        res.status(500).json({ message: "Erreur lors de la création du produit." });
    }
});

// ROUTE : Modifier un produit
router.put('/:id', auth, async (req, res) => {
    try {
        const { nom, description, prix, image, categorie, stock, ingredients, allergenes, certifieSansGluten, bio, actif } = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { nom, description, prix, image, categorie, stock, ingredients, allergenes, certifieSansGluten, bio, actif },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Produit non trouvé." });
        }

        res.json({ message: "Produit mis à jour avec succès !", product: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la modification du produit." });
    }
});

// ROUTE : Supprimer un produit
router.delete('/:id', auth, async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
            return res.status(404).json({ message: "Produit non trouvé." });
        }

        res.json({ message: "Produit supprimé avec succès !" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression du produit." });
    }
});

module.exports = router;
