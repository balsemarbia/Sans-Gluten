const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ROUTE : Inscription
router.post('/register', async (req, res) => {
    try {
        // Log pour voir ce que le frontend envoie réellement
        console.log("📥 Données reçues pour inscription:", req.body);

        const { nom, prenom, age, genre, region, telephone, email, password } = req.body;

        // 1. Vérification des champs vides
        if (!email || !password || !nom) {
            return res.status(400).json({ message: "Les champs obligatoires sont manquants." });
        }

        // 2. Vérifier si l'utilisateur existe déjà
        let user = await User.findOne({ email: email.toLowerCase() }); // On compare en minuscule
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
            prenom,
            age: Number(age), // On s'assure que c'est un nombre pour MongoDB
            genre,
            region,
            telephone,
            email: email.toLowerCase(),
            password: hashedPassword
        });

        await newUser.save();
        console.log("✅ Utilisateur créé avec succès dans la base !");
        res.status(201).json({ message: "Utilisateur créé ! 🎉" });

    } catch (error) {
        console.error("🔥 Erreur Register:", error.message);
        // Si c'est une erreur de validation Mongoose
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
            user: { id: user._id, nom: user.nom, prenom: user.prenom } 
        });
    } catch (error) {
        console.error("🔥 Erreur Login:", error);
        res.status(500).json({ message: "Erreur serveur lors de la connexion." });
    }
});

module.exports = router;