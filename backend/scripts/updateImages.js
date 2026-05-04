/**
 * Script to update all product and recipe images with working URLs
 */

const mongoose = require('mongoose');
const Product = require('../models/Product');
const Recipe = require('../models/Recipe');
require('dotenv').config();

// High-quality images from Unsplash for gluten-free products
const productImages = {
  'Farines': [
    'https://images.unsplash.com/photo-1586496436937-2c1e1e6d0f3c?w=800&q=80',
    'https://images.unsplash.com/photo-1578314675246-a4714cd3f62a?w=800&q=80',
    'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&q=80',
    'https://images.unsplash.com/photo-1517433670267-08bb93c5a3b1?w=800&q=80'
  ],
  'Pains': [
    'https://images.unsplash.com/photo-1509440159596-7241a558f172?w=800&q=80',
    'https://images.unsplash.com/photo-1585476644320-b4e3b6b3d3c6?w=800&q=80',
    'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=800&q=80',
    'https://images.unsplash.com/photo-1509440159596-7241a558f172?w=800&q=80'
  ],
  'Pâtisseries': [
    'https://images.unsplash.com/photo-1558326567-98ae2405596b?w=800&q=80',
    'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=800&q=80',
    'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&q=80',
    'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80'
  ],
  'Snacks': [
    'https://images.unsplash.com/photo-1499636136210-6f9eeae975e4?w=800&q=80',
    'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&q=80',
    'https://images.unsplash.com/photo-1517686469429-8bdb4f4df6bb?w=800&q=80',
    'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&q=80'
  ],
  'default': [
    'https://images.unsplash.com/photo-1543362906-acfc16c64564?w=800&q=80',
    'https://images.unsplash.com/photo-1574312750773-912e999d1d55?w=800&q=80',
    'https://images.unsplash.com/photo-1586496436937-2c1e1e6d0f3c?w=800&q=80'
  ]
};

// High-quality images from Unsplash for recipes
const recipeImages = [
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80',
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80',
  'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&q=80',
  'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80',
  'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&q=80',
  'https://images.unsplash.com/photo-1547592166-23ac4578acd4?w=800&q=80',
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80',
  'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80'
];

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pfe_sans_gluten';

mongoose.connect(mongoUri)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    console.log('');

    // Update Products
    console.log('🔄 Updating product images...');
    const products = await Product.find({});
    let productCount = 0;

    for (const product of products) {
      // Get appropriate images for category
      const categoryImages = productImages[product.categorie] || productImages['default'];
      const randomImage = categoryImages[Math.floor(Math.random() * categoryImages.length)];

      product.image = randomImage;
      await product.save();
      productCount++;

      console.log(`   ✓ ${product.nom}`);
    }

    console.log(`✅ Updated ${productCount} product images`);
    console.log('');

    // Update Recipes
    console.log('🔄 Updating recipe images...');
    const recipes = await Recipe.find({});
    let recipeCount = 0;

    for (const recipe of recipes) {
      const randomImage = recipeImages[Math.floor(Math.random() * recipeImages.length)];

      recipe.image = randomImage;
      await recipe.save();
      recipeCount++;

      console.log(`   ✓ ${recipe.titre}`);
    }

    console.log(`✅ Updated ${recipeCount} recipe images`);
    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('✨ All images have been updated successfully!');
    console.log('═══════════════════════════════════════════════════════════');

    mongoose.connection.close();
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
