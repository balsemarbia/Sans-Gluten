const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/authMiddleware'); // Ton "videur" de sécurité

// ROUTE : Créer une nouvelle commande
// Seul un utilisateur avec un Token valide peut arriver ici
router.post('/confirm', auth, async (req, res) => {
    try {
        const { items, total } = req.body;

        const newOrder = new Order({
            userId: req.user.id, // ID extrait du Token par le middleware
            items,
            total
        });

        const savedOrder = await newOrder.save();
        res.status(201).json({ 
            message: "Commande enregistrée avec succès ! 🎉", 
            orderId: savedOrder._id 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la validation de la commande." });
    }
});

// ROUTE : Voir mes commandes (pour la page Profil par exemple)
router.get('/my-orders', auth, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id }).sort({ date: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Impossible de récupérer vos commandes." });
    }
});

module.exports = router;