const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // 1. On récupère le "bracelet" (token) dans l'en-tête de la requête
    const token = req.header('x-auth-token');

    // 2. Si pas de token, on arrête tout et on renvoie une erreur 401 (Non autorisé)
    if (!token) {
        return res.status(401).json({ message: "Accès refusé. Connectez-vous d'abord." });
    }

    try {
        // 3. On vérifie si le bracelet est un vrai (signé avec ta clé secrète)
        const verified = jwt.verify(token, 'TON_CODE_SECRET_ICI');
        
        // 4. On ajoute les infos de l'utilisateur dans la requête pour que la suite y ait accès
        req.user = verified;

        // 5. Tout est OK ! On appelle next() pour laisser la commande s'exécuter
        next();
    } catch (err) {
        // Si le token est faux ou expiré
        res.status(400).json({ message: "Session invalide ou expirée." });
    }
};