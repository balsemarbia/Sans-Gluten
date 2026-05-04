const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const Recipe = require('../models/Recipe');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Middleware pour vérifier si l'utilisateur est admin
const adminAuth = async (req, res, next) => {
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ message: "Accès refusé. Connectez-vous d'abord." });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET || 'TON_CODE_SECRET_PFE');
        req.user = verified;

        // Vérifier si l'utilisateur a le rôle admin
        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: "Accès refusé. Administration uniquement." });
        }

        next();
    } catch (err) {
        res.status(401).json({ message: "Session invalide ou expirée." });
    }
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

// ROUTE : Récupérer une commande par ID (pour admin) - DOIT ÊTRE AVANT /orders
router.get('/orders/:id', adminAuth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('userId', 'nom prenom email telephone');

        if (!order) {
            return res.status(404).json({ message: "Commande non trouvée." });
        }

        res.json(order);
    } catch (error) {
        console.error('Erreur récupération commande:', error);
        res.status(500).json({ message: "Erreur lors de la récupération de la commande." });
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

        const validStatuses = ['En attente', 'En cours', 'En préparation', 'Expédiée', 'Livré', 'Annulée'];
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

// ROUTE : Promouvoir un utilisateur en admin
router.put('/users/:id/role', adminAuth, async (req, res) => {
    try {
        const { role } = req.body;

        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ message: "Rôle invalide." });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        res.json({ message: "Rôle mis à jour !", user });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du rôle." });
    }
});

module.exports = router;
