const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const auth = require('../middleware/authMiddleware');

// ROUTE : Créer une nouvelle commande
router.post('/', auth, async (req, res) => {
    try {
        console.log("📦 Données de commande reçues:", req.body);
        console.log("👤 User ID from token:", req.user.id);

        const { items, adresse, couponCode, discount, shippingCost } = req.body;

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

        // Calculer le sous-total (prix des produits sans réduction ni livraison)
        const subtotal = itemsWithDetails.reduce((sum, item) => sum + (item.prix * item.quantite), 0);

        // Utiliser les valeurs envoyées depuis le frontend ou les valeurs par défaut
        const finalShippingCost = shippingCost || 7;
        const finalDiscount = discount || 0;
        const finalTotal = subtotal + finalShippingCost - finalDiscount;

        const newOrder = new Order({
            userId: req.user.id,
            items: itemsWithDetails,
            subtotal: subtotal,
            shippingCost: finalShippingCost,
            coupon: couponCode ? {
                code: couponCode,
                discount: finalDiscount
            } : undefined,
            discount: finalDiscount,
            total: finalTotal,
            adresse,
            statut: 'En cours'
        });

        const savedOrder = await newOrder.save();
        console.log("✅ Order saved with ID:", savedOrder._id, "for user:", savedOrder.userId);
        console.log("💰 Order details - Subtotal:", subtotal, "Shipping:", finalShippingCost, "Discount:", finalDiscount, "Total:", finalTotal);

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

// ROUTE : Voir mes commandes (must come before /:id to avoid route conflicts)
router.get('/my-orders', auth, async (req, res) => {
    try {
        console.log("📋 Fetching orders for user:", req.user.id);

        const orders = await Order.find({ userId: req.user.id })
            .sort({ date: -1 })
            .populate('userId', 'nom email')
            .populate('items.productId', 'nom image prix');

        console.log(`📦 Found ${orders.length} orders for user ${req.user.id}`);
        console.log("Orders:", orders.map(o => ({ id: o._id, total: o.total, statut: o.statut })));

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

// ROUTE : Récupérer une commande par ID (must come LAST to avoid conflicts with specific routes)
router.get('/:id', auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('userId', 'nom email')
            .populate('items.productId', 'nom image prix');

        if (!order) {
            return res.status(404).json({ message: "Commande non trouvée." });
        }

        // Check if user owns this order or is admin
        if (order.userId._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Accès refusé." });
        }

        res.json(order);
    } catch (error) {
        console.error("❌ Erreur récupération commande:", error);
        res.status(500).json({ message: "Impossible de récupérer cette commande." });
    }
});

module.exports = router;