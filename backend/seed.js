const mongoose = require('mongoose');
const Product = require('./models/Product');
const Recipe = require('./models/Recipe');
require('dotenv').config();

// Sample Products
const sampleProducts = [
  {
    nom: 'Farine de Riz Complète Bio',
    description: 'Farine de riz complète certifiée sans gluten, idéale pour vos préparations culinaires. Riche en fibres et nutriments.',
    prix: 12.500,
    image: 'https://images.unsplash.com/photo-1586496436937-2c1e1e6d0f3c?w=500',
    categorie: 'Farines',
    stock: 50,
    ingredients: ['Farine de riz complète 100%'],
    allergenes: [],
    certifieSansGluten: true,
    bio: true,
    actif: true
  },
  {
    nom: 'Farine de Maïs Bio',
    description: 'Farine de maïs biologique, parfaite pour les pains et gâteaux sans gluten.',
    prix: 8.900,
    image: 'https://images.unsplash.com/photo-1578314675246-a4714cd3f62a?w=500',
    categorie: 'Farines',
    stock: 35,
    ingredients: ['Farine de maïs 100%'],
    allergenes: [],
    certifieSansGluten: true,
    bio: true,
    actif: true
  },
  {
    nom: 'Farine de Sarrasin Bio',
    description: 'Farine de sarrasin traditionnelle, excellente pour les galettes et crêpes.',
    prix: 15.200,
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500',
    categorie: 'Farines',
    stock: 25,
    ingredients: ['Farine de sarrasin 100%'],
    allergenes: [],
    certifieSansGluten: true,
    bio: true,
    actif: true
  },
  {
    nom: 'Pain Sans Gluten Complet',
    description: 'Pain complet sans gluten au levain naturel, croustillant à l\'extérieur et moelleux à l\'intérieur.',
    prix: 6.500,
    image: 'https://images.unsplash.com/photo-1509440159596-7241a558f172?w=500',
    categorie: 'Pains',
    stock: 15,
    ingredients: ['Farine de riz', 'Farine de sarrasin', 'Levain naturel', 'Eau', 'Sel'],
    allergenes: [],
    certifieSansGluten: true,
    bio: true,
    actif: true
  },
  {
    nom: 'Pain aux Céréales Bio',
    description: 'Pain sans gluten riche en céréales variées pour un goût authentique.',
    prix: 7.800,
    image: 'https://images.unsplash.com/photo-1585476644320-b4e3b6b3d3c6?w=500',
    categorie: 'Pains',
    stock: 20,
    ingredients: ['Farine de riz', 'Farine de maïs', 'Flocons de sarrasin', 'Levain', 'Eau', 'Sel'],
    allergenes: [],
    certifieSansGluten: true,
    bio: true,
    actif: true
  },
  {
    nom: 'Gâteaux Sans Gluten (Assortiment)',
    description: 'Assortiment de pâtisseries fines sans gluten : financiers, madeleines et biscuits.',
    prix: 25.000,
    image: 'https://images.unsplash.com/photo-1558326567-98ae2405596b?w=500',
    categorie: 'Pâtisseries',
    stock: 10,
    ingredients: ['Farine de riz', 'Amandes', 'Œufs', 'Beurre', 'Sucre'],
    allergenes: ['Œufs', 'Amandes', 'Lait'],
    certifieSansGluten: true,
    bio: true,
    actif: true
  },
  {
    nom: 'Cookies Chocolat Sans Gluten',
    description: 'Délicieux cookies au chocolat fondant, sans gluten mais avec tout le goût !',
    prix: 8.500,
    image: 'https://images.unsplash.com/photo-1499636136210-6f9eeae975e4?w=500',
    categorie: 'Snacks',
    stock: 40,
    ingredients: ['Farine de riz', 'Chocolat noir', 'Beurre', 'Sucre', 'Œufs'],
    allergenes: ['Œufs', 'Lait'],
    certifieSansGluten: true,
    bio: false,
    actif: true
  },
  {
    nom: 'Barres Énergétiques Fruits Secs',
    description: 'Barres énergétiques aux fruits secs et noix, idéales pour les encas sains.',
    prix: 5.900,
    image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=500',
    categorie: 'Snacks',
    stock: 60,
    ingredients: ['Dattes', 'Amandes', 'Noisettes', 'Figues', 'Miel'],
    allergenes: ['Fruits à coque'],
    certifieSansGluten: true,
    bio: true,
    actif: true
  },
  {
    nom: 'Pâtes de Riz Complètes',
    description: 'Pâtes de riz complètes, idéales pour accompagner vos sauces favorites.',
    prix: 9.200,
    image: 'https://images.unsplash.com/photo-1551462147-ff906c8bf1b7?w=500',
    categorie: 'Autres',
    stock: 30,
    ingredients: ['Farine de riz complète', 'Eau'],
    allergenes: [],
    certifieSansGluten: true,
    bio: false,
    actif: true
  },
  {
    nom: 'Mix Farine Pain Maison',
    description: 'Mix de farines prêt à l\'emploi pour réaliser votre pain sans gluten à la maison.',
    prix: 18.900,
    image: 'https://images.unsplash.com/photo-1517433670267-08bb93c5a3b1?w=500',
    categorie: 'Farines',
    stock: 25,
    ingredients: ['Farine de riz', 'Farine de sarrasin', 'Farine de maïs', 'Poudre à lever'],
    allergenes: [],
    certifieSansGluten: true,
    bio: true,
    actif: true
  },
  {
    nom: 'Granola Sans Gluten Bio',
    description: 'Mélange croustillant de flocons de sarrasin, fruits secs et miel pour vos petits-déjeuners.',
    prix: 14.500,
    image: 'https://images.unsplash.com/photo-1517686469429-8bdb4f4df6bb?w=500',
    categorie: 'Snacks',
    stock: 35,
    ingredients: ['Flocons de sarrasin', 'Amandes', 'Noisettes', 'Miel', 'Huile de coco'],
    allergenes: ['Fruits à coque'],
    certifieSansGluten: true,
    bio: true,
    actif: true
  },
  {
    nom: 'Tarte aux Citrons Sans Gluten',
    description: 'Tarte au citron meringuée, une pâtisserie classique sans gluten.',
    prix: 22.000,
    image: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=500',
    categorie: 'Pâtisseries',
    stock: 8,
    ingredients: ['Farine de riz', 'Citrons', 'Œufs', 'Beurre', 'Sucre'],
    allergenes: ['Œufs', 'Lait'],
    certifieSansGluten: true,
    bio: false,
    actif: true
  }
];

// Sample Recipes
const sampleRecipes = [
  {
    titre: 'Pain Sans Gluten Maison',
    description: 'Apprenez à réaliser votre propre pain sans gluten avec cette recette simple et délicieuse. Un pain moelleux et savoureux qui ravira toute la famille.',
    image: 'https://images.unsplash.com/photo-1509440159596-7241a558f172?w=500',
    temps: '1h30',
    difficulte: 'Moyen',
    ingredients: [
      '300g de farine de riz complète',
      '200g de farine de sarrasin',
      '1 sachet de levain sans gluten',
      '300ml d\'eau tiède',
      '1 cuillère à café de sel',
      '1 cuillère à soupe de sucre',
      '2 cuillères à soupe d\'huile d\'olive'
    ],
    instructions: `1. Mélangez les farines avec le sel et le sucre dans un grand bol.
2. Diluez le levain dans l\'eau tiède et laissez reposer 10 minutes.
3. Versez le mélange liquide sur les farines et mélangez jusqu\'à obtenir une pâte homogène.
4. Pétrissez la pâte pendant 10 minutes jusqu\'à ce qu\'elle soit élastique.
5. Formez un pain et placez-le dans un moule beurré.
6. Laissez lever pendant 1h30 à l\'abri des courants d\'air.
7. Préchauffez votre four à 220°C.
8. Enfournez pour 30-35 minutes jusqu\'à ce que le pain soit doré.
9. Laissez refroidir sur une grille avant de déguster.`,
    portions: 8,
    categorie: 'Petit-déjeuner',
    actif: true
  },
  {
    titre: 'Crêpes Bretonnes Sans Gluten',
    description: 'Des crêpes fines et légères, traditionnelles de Bretagne, mais sans gluten pour le plaisir de tous !',
    image: 'https://images.unsplash.com/photo-1498684847186-3d2560b4a67e?w=500',
    temps: '45 min',
    difficulte: 'Facile',
    ingredients: [
      '250g de farine de sarrasin',
      '2 œufs',
      '500ml de lait',
      '1 pincée de sel',
      '50g de beurre fondu',
      'Eau pour la pâte à crêpes'
    ],
    instructions: `1. Dans un grand bol, versez la farine de sarrasin et faites un puits au centre.
2. Cassez les œufs dans le puits et ajoutez le sel.
3. Mélangez progressivement en incorporant le lait petit à petit.
4. Ajoutez 50ml d\'eau pour obtenir une pâte liquide et lisse.
5. Faites chauffer une poêle à crêpe avec un peu de beurre.
6. Versez une louche de pâte et inclinez la poêle pour répartir la pâte uniformément.
7. Laissez cuire 1-2 minutes de chaque côté jusqu\'à ce que la crêpe soit dorée.
8. Répétez jusqu\'à épuisement de la pâte.
9. Servez avec du sucre, du citron, ou de la confiture selon vos préférences.`,
    portions: 6,
    categorie: 'Petit-déjeuner',
    actif: true
  },
  {
    titre: 'Cookies Chocolat & Noisettes',
    description: 'Des cookies moelleux au chocolat et aux noisettes, sans gluten mais délicieusement gourmands !',
    image: 'https://images.unsplash.com/photo-1499636136210-6f9eeae975e4?w=500',
    temps: '30 min',
    difficulte: 'Facile',
    ingredients: [
      '150g de farine de riz',
      '100g de beurre mou',
      '80g de sucre roux',
      '1 œuf',
      '100g de chocolat noir',
      '50g de noisettes concassées',
      '1 cuillère à café de levure chimique'
    ],
    instructions: `1. Préchauffez votre four à 180°C.
2. Fouettez le beurre mou avec le sucre jusqu\'à obtenir une crème.
3. Ajoutez l\'œuf et mélangez bien.
4. Incorporez la farine et la levure chimique.
5. Ajoutez le chocolat et les noisettes concassées.
6. Formez des boulettes de pâte et disposez-les sur une plaque de cuisson.
7. Aplatissez légèrement chaque boulette avec une fourchette.
8. Enfournez pour 12-15 minutes jusqu\'à ce que les cookies soient dorés.
9. Laissez refroidir avant de déguster.`,
    portions: 20,
    categorie: 'Snack',
    actif: true
  },
  {
    titre: 'Quinoa Légumes Rôtis',
    description: 'Un plat complet et équilibré, parfait pour un déjeuner sain et savoureux.',
    image: 'https://images.unsplash.com/photo-1511690626139-02791b436ec8?w=500',
    temps: '40 min',
    difficulte: 'Facile',
    ingredients: [
      '200g de quinoa',
      '1 courgette',
      '1 poivron rouge',
      '1 oignon rouge',
      '2 cuillères à soupe d\'huile d\'olive',
      'Herbes de Provence',
      'Sel et poivre'
    ],
    instructions: `1. Rincez le quinoa à l\'eau claire et cuisez-le selon les instructions du paquet (environ 15 minutes).
2. Coupez les légumes en dés.
3. Faites chauffer l\'huile d\'olive dans une poêle et ajoutez les légumes.
4. Faites rôtir les légumes à feu moyen pendant 15-20 minutes.
5. Ajoutez les herbes de Provence, le sel et le poivre.
6. Mélangez le quinoa cuit avec les légumes rôtis.
7. Servez chaud, éventuellement avec un filet d\'huile d\'olive supplémentaire.`,
    portions: 4,
    categorie: 'Déjeuner',
    actif: true
  },
  {
    titre: 'Tarte Pommes Cannelle Sans Gluten',
    description: 'Une tarte aux pommes classique, avec une croûte croustillante sans gluten et une touche de cannelle.',
    image: 'https://images.unsplash.com/photo-1568571780765-1b6e2ef1bb1b?w=500',
    temps: '1h',
    difficulte: 'Moyen',
    ingredients: [
      '200g de farine de riz',
      '100g de farine d\'amande',
      '100g de beurre froid',
      '50g de sucre',
      '1 œuf',
      '4 pommes',
      '1 cuillère à café de cannelle',
      '50g de poudre d\'amandes'
    ],
    instructions: `1. Préparez la pâte : mélangez les farines avec le sucre.
2. Incorporez le beurre froid en morceaux et pétrissez du bout des doigts.
3. Ajoutez l\'œuf et mélangez jusqu\'à obtenir une boule de pâte.
4. Étalez la pâte et foncez un moule à tarte.
5. Réfrigérez pendant 30 minutes.
6. Épluchez et coupez les pommes en fines lamelles.
7. Disposez les pommes sur la pâte.
8. Saupoudrez de cannelle et de poudre d\'amandes.
9. Enfournez à 180°C pendant 40-45 minutes jusqu\'à ce que la tarte soit dorée.`,
    portions: 8,
    categorie: 'Dessert',
    actif: true
  },
  {
    titre: 'Riz Cantonais Aux Crevettes',
    description: 'Un plat complet exotique, riche en saveurs et en couleurs.',
    image: 'https://images.unsplash.com/photo-1534422298390-e4eb811ab4f2?w=500',
    temps: '35 min',
    difficulte: 'Facile',
    ingredients: [
      '200g de riz basmati',
      '200g de crevettes décortiquées',
      '1 poivron rouge',
      '1 petit pois',
      '2 œufs',
      '2 cuillères à soupe de sauce soja',
      '1 cuillère à soupe d\'huile de sésame'
    ],
    instructions: `1. Faites cuire le riz selon les instructions du paquet.
2. Faites revenir les crevettes dans une poêle chaude avec de l\'huile.
3. Ajoutez les légumes coupés en petits dés et faites cuire 5 minutes.
4. Ajoutez le riz cuit et la sauce soja, mélangez bien.
5. Créez un puits au centre et cassez les œufs.
6. Mélangez les œufs avec le riz chaud jusqu\'à ce qu\'ils soient cuits.
7. Servez chaud, parsemé d\'huile de sésame.`,
    portions: 4,
    categorie: 'Dîner',
    actif: true
  },
  {
    titre: 'Smoothie Bowl Fruits Rouges',
    description: 'Un bol de smoothie frais et coloré, plein d\'énergie pour bien commencer la journée.',
    image: 'https://images.unsplash.com/photo-1494544385005-2be64e138576?w=500',
    temps: '10 min',
    difficulte: 'Facile',
    ingredients: [
      '200g de fruits rouges surgelés (fraises, framboises, myrtilles)',
      '1 banane',
      '200ml de lait d\'amande',
      '50g de granola sans gluten',
      '1 cuillère à soupe de miel',
      'Fruits frais pour la décoration'
    ],
    instructions: `1. Mixez les fruits rouges surgelés avec la banane et le lait d\'amande.
2. Versez le smoothie dans un bol.
3. Ajoutez le granola sur le dessus.
4. Arrosez de miel.
5. Décorez avec des fruits frais.
6. Servez immédiatement pour profiter de toutes les textures.`,
    portions: 2,
    categorie: 'Petit-déjeuner',
    actif: true
  },
  {
    titre: 'Curry de Légumes de Saison',
    description: 'Un curry réconfortant et parfumé, rempli de légumes de saison.',
    image: 'https://images.unsplash.com/photo-1515563128276-5b1e7d747b0e?w=500',
    temps: '45 min',
    difficulte: 'Facile',
    ingredients: [
      '2 carottes',
      '2 pommes de terre',
      '1 courgette',
      '1 oignon',
      '2 cuillères à soupe de curry en poudre',
      '400ml de lait de coco',
      'Riz basmati',
      'Cilantro frais'
    ],
    instructions: `1. Coupez tous les légumes en morceaux réguliers.
2. Faites revenir l\'oignon dans une marmite avec un peu d\'huile.
3. Ajoutez le curry et mélangez pendant 1 minute.
4. Ajoutez les légumes et mélangez bien.
5. Versez le lait de coco et ajoutez de l\'eau pour couvrir les légumes.
6. Laissez mijoter 30 minutes à feu doux.
7. Servez chaud avec du riz et du cilantro frais.`,
    portions: 4,
    categorie: 'Dîner',
    actif: true
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pfe_sans_gluten');
    console.log('✅ Connecté à MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await Recipe.deleteMany({});
    console.log('🗑️  Anciennes données supprimées');

    // Insert products
    const products = await Product.insertMany(sampleProducts);
    console.log(`✅ ${products.length} produits ajoutés`);

    // Insert recipes
    const recipes = await Recipe.insertMany(sampleRecipes);
    console.log(`✅ ${recipes.length} recettes ajoutées`);

    console.log('\n🎉 Base de données peuplée avec succès !');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

seedDatabase();
