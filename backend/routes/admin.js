const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const Recipe = require('../models/Recipe');
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');

// Middleware pour vérifier si l'utilisateur est admin
const adminAuth = (req, res, next) => {
    // Pour l'instant, on suppose que tous les utilisateurs connectés sont admin
    // Dans un vrai projet, vous devriez ajouter un champ "role" au User model
    auth(req, res, next);
};

// ROUTE : Statistiques du dashboard
router.get('/stats', adminAuth, async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const totalRevenue = await Order.aggregate([
            { $group: { _id: null, total: { $sum: "$total" } } }
        ]);
        const totalUsers = await User.countDocuments();
        const lowStockProducts = await Product.countDocuments({ stock: { $lt: 10 } });

        res.json({
            orders: totalOrders,
            revenue: totalRevenue[0]?.total || 0,
            users: totalUsers,
            lowStock: lowStockProducts
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des statistiques." });
    }
});

// ROUTE : Récupérer toutes les commandes (pour admin)
router.get('/orders', adminAuth, async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('userId', 'nom prenom email telephone')
            .sort({ date: -1 });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des commandes." });
    }
});

// ROUTE : Mettre à jour le statut d'une commande
router.put('/orders/:id/status', adminAuth, async (req, res) => {
    try {
        const { statut } = req.body;

        const validStatuses = ['En attente', 'En préparation', 'Expédiée', 'Livré', 'Annulée'];
        if (!validStatuses.includes(statut)) {
            return res.status(400).json({ message: "Statut invalide." });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { statut },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: "Commande non trouvée." });
        }

        res.json({ message: "Statut mis à jour !", order });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du statut." });
    }
});

// ROUTE : Récupérer tous les produits (y compris inactifs)
router.get('/products', adminAuth, async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des produits." });
    }
});

// ROUTE : Récupérer toutes les recettes (y compris inactives)
router.get('/recipes', adminAuth, async (req, res) => {
    try {
        const recipes = await Recipe.find().populate('createur', 'nom prenom').sort({ createdAt: -1 });
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des recettes." });
    }
});

// ROUTE : Récupérer tous les utilisateurs
router.get('/users', adminAuth, async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs." });
    }
});

module.exports = router;
