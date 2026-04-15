const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- CONFIGURATION DES MIDDLEWARES ---
// On les place AVANT les routes pour qu'ils préparent les données
app.use(cors()); 
app.use(express.json()); 

// Petit middleware de log pour voir tes clics dans le terminal
app.use((req, res, next) => {
  console.log(`📡 Appel reçu : ${req.method} ${req.url}`);
  next();
});

// --- IMPORTATION DES ROUTES ---
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');

// --- UTILISATION DES ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

// --- CONNEXION À MONGODB ---
mongoose.connect('mongodb://127.0.0.1:27017/pfe_sans_gluten')
  .then(() => console.log("Connexion à MongoDB réussie ! ✅"))
  .catch(err => console.error("Erreur de connexion MongoDB :", err));

// Route de test
app.get('/', (req, res) => {
  res.send("Le serveur Sans Gluten tourne parfaitement ! 🚀");
});

// --- DÉMARRAGE DU SERVEUR ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
  🚀 Serveur démarré !
  🌐 Local: http://localhost:${PORT}
  📶 Réseau: http://192.168.1.17:${PORT}
  `);
});