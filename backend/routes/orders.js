const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const auth = require('../middleware/authMiddleware');

// ROUTE : Créer une nouvelle commande
router.post('/', auth, async (req, res) => {
    try {
        console.log("📦 Données de commande reçues:", req.body);

        const { items, adresse } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "Le panier est vide." });
        }

        // Récupérer les informations des produits depuis la base de données
        const itemsWithDetails = await Promise.all(
            items.map(async (item) => {
                const product = await Product.findById(item.produit);
                if (!product) {
                    throw new Error(`Produit ${item.produit} non trouvé`);
                }
                return {
                    productId: item.produit,
                    nom: product.nom,
                    quantite: item.quantite,
                    prix: product.prix
                };
            })
        );

        // Calculer le total
        const total = itemsWithDetails.reduce((sum, item) => sum + (item.prix * item.quantite), 0);

        const newOrder = new Order({
            userId: req.user.id,
            items: itemsWithDetails,
            total,
            adresse,
            statut: 'En cours'
        });

        const savedOrder = await newOrder.save();

        // Populate avec les infos utilisateur pour le retour
        const populatedOrder = await Order.findById(savedOrder._id)
            .populate('userId', 'nom email')
            .populate('items.productId', 'nom image');

        res.status(201).json({
            message: "Commande créée avec succès !",
            order: savedOrder
        });
    } catch (error) {
        console.error("❌ Erreur création commande:", error.message);
        res.status(500).json({ message: error.message || "Erreur lors de la création de la commande." });
    }
});

// ROUTE : Voir mes commandes
router.get('/my-orders', auth, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id })
            .sort({ date: -1 })
            .populate('userId', 'nom email')
            .populate('items.productId', 'nom image prix');

        res.json(orders);
    } catch (error) {
        console.error("❌ Erreur récupération commandes:", error);
        res.status(500).json({ message: "Impossible de récupérer vos commandes." });
    }
});

// ROUTE : Voir toutes les commandes (admin)
router.get('/all', auth, async (req, res) => {
    try {
        const orders = await Order.find({})
            .sort({ date: -1 })
            .populate('userId', 'nom email')
            .populate('items.productId', 'nom image prix');

        res.json(orders);
    } catch (error) {
        console.error("❌ Erreur récupération commandes admin:", error);
        res.status(500).json({ message: "Impossible de récupérer les commandes." });
    }
});

module.exports = router;