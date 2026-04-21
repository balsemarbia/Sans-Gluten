const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');

// ROUTE : Récupérer le profil de l'utilisateur connecté
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération du profil." });
    }
});

// ROUTE : Obtenir le rôle de l'utilisateur connecté
router.get('/role', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('role');
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }
        res.json({ role: user.role || 'user' });
    } catch (error) {
        console.error("Erreur rôle:", error);
        res.status(500).json({ message: "Erreur lors de la récupération du rôle." });
    }
});

// ROUTE : Mettre à jour le profil de l'utilisateur connecté
router.put('/profile', auth, async (req, res) => {
    try {
        const { nom, prenom, age, genre, region, telephone } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { nom, prenom, age, genre, region, telephone },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        res.json({ message: "Profil mis à jour !", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du profil." });
    }
});

// ROUTE : Changer le mot de passe
router.put('/change-password', auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Les mots de passe sont obligatoires." });
        }

        const user = await User.findById(req.user.id);

        const bcrypt = require('bcryptjs');
        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Mot de passe actuel incorrect." });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ message: "Mot de passe changé avec succès !" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors du changement de mot de passe." });
    }
});

module.exports = router;
