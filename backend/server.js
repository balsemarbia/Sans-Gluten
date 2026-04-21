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
const productRoutes = require('./routes/products');
const recipeRoutes = require('./routes/recipes');
const favoriteRoutes = require('./routes/favorites');
const addressRoutes = require('./routes/addresses');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');

// --- UTILISATION DES ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// --- CONNEXION À MONGODB ---
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pfe_sans_gluten';
mongoose.connect(mongoUri)
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