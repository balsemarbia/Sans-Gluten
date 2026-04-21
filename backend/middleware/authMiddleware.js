const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ message: "Accès refusé. Connectez-vous d'abord." });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET || 'TON_CODE_SECRET_PFE');
        req.user = verified;
        next();
    } catch (err) {
        res.status(401).json({ message: "Session invalide ou expirée." });
    }
};