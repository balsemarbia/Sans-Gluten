const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Recipe = require('../models/Recipe');

// Helper route to update all images (temporary, can be removed)
router.post('/update-images', async (req, res) => {
  try {
    const productImages = [
      'https://images.unsplash.com/photo-1586496436937-2c1e1e6d0f3c?w=800&q=80',
      'https://images.unsplash.com/photo-1578314675246-a4714cd3f62a?w=800&q=80',
      'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&q=80',
      'https://images.unsplash.com/photo-1509440159596-7241a558f172?w=800&q=80',
      'https://images.unsplash.com/photo-1585476644320-b4e3b6b3d3c6?w=800&q=80',
      'https://images.unsplash.com/photo-1558326567-98ae2405596b?w=800&q=80',
      'https://images.unsplash.com/photo-1499636136210-6f9eeae975e4?w=800&q=80',
      'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&q=80',
      'https://images.unsplash.com/photo-1551462147-ff906c8bf1b7?w=800&q=80',
      'https://images.unsplash.com/photo-1517433670267-08bb93c5a3b1?w=800&q=80',
      'https://images.unsplash.com/photo-1517686469429-8bdb4f4df6bb?w=800&q=80',
      'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=800&q=80'
    ];

    const recipeImages = [
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80',
      'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&q=80',
      'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80',
      'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&q=80',
      'https://images.unsplash.com/photo-1547592166-23ac4578acd4?w=800&q=80',
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80',
      'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80'
    ];

    // Update Products
    const products = await Product.find({});
    for (const product of products) {
      const randomImage = productImages[Math.floor(Math.random() * productImages.length)];
      product.image = randomImage;
      await product.save();
    }

    // Update Recipes
    const recipes = await Recipe.find({});
    for (const recipe of recipes) {
      const randomImage = recipeImages[Math.floor(Math.random() * recipeImages.length)];
      recipe.image = randomImage;
      await recipe.save();
    }

    res.json({
      message: 'Images updated successfully',
      products: products.length,
      recipes: recipes.length
    });
  } catch (error) {
    console.error('Error updating images:', error);
    res.status(500).json({ message: 'Error updating images' });
  }
});

module.exports = router;
