const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ROUTE : Inscription
router.post('/register', async (req, res) => {
    try {
        console.log("📥 Données reçues pour inscription:", req.body);

        const { nom, email, password, prenom, telephone } = req.body;

        // 1. Vérification des champs obligatoires
        if (!email || !password || !nom) {
            return res.status(400).json({ message: "Les champs obligatoires sont manquants." });
        }

        // 2. Vérifier si l'utilisateur existe déjà
        let user = await User.findOne({ email: email.toLowerCase() });
        if (user) {
            console.log("❌ Email déjà utilisé:", email);
            return res.status(400).json({ message: "Cet email est déjà utilisé." });
        }

        // 3. Hashage du mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Création du nouvel utilisateur
        const newUser = new User({
            nom,
            prenom: prenom || nom, // Utiliser nom comme prenom si non fourni
            email: email.toLowerCase(),
            password: hashedPassword,
            telephone
        });

        await newUser.save();
        console.log("✅ Utilisateur créé avec succès !");

        // 5. Création du token pour connexion automatique
        const token = jwt.sign(
            { id: newUser._id },
            process.env.JWT_SECRET || 'TON_CODE_SECRET_PFE',
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: "Compte créé avec succès !",
            token,
            user: {
                id: newUser._id,
                nom: newUser.nom,
                email: newUser.email
            }
        });

    } catch (error) {
        console.error("🔥 Erreur Register:", error.message);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: "Données invalides : " + error.message });
        }
        res.status(500).json({ message: "Erreur lors de l'inscription sur le serveur." });
    }
});

// ROUTE : Connexion
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("🔑 Tentative de connexion pour:", email);

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(400).json({ message: "Utilisateur non trouvé." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Mot de passe incorrect." });

        // CRÉATION DU TOKEN
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || 'TON_CODE_SECRET_PFE',
            { expiresIn: '24h' }
        );

        res.status(200).json({
            token,
            user: {
                id: user._id,
                nom: user.nom,
                email: user.email
            }
        });
    } catch (error) {
        console.error("🔥 Erreur Login:", error);
        res.status(500).json({ message: "Erreur serveur lors de la connexion." });
    }
});

module.exports = router;