/**
 * Script to promote a user to admin role
 * Usage: node scripts/setupAdmin.js <email>
 */

const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const email = process.argv[2];

if (!email) {
  console.log('Usage: node scripts/setupAdmin.js <email>');
  console.log('Example: node scripts/setupAdmin.js admin@example.com');
  process.exit(1);
}

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pfe_sans_gluten';

mongoose.connect(mongoUri)
  .then(async () => {
    console.log('✅ Connected to MongoDB');

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.log(`❌ User with email "${email}" not found`);
      console.log('Please register this user first, then run this script again.');
      mongoose.connection.close();
      process.exit(1);
    }

    if (user.role === 'admin') {
      console.log(`ℹ️  User "${email}" is already an admin`);
      mongoose.connection.close();
      process.exit(0);
    }

    user.role = 'admin';
    await user.save();

    console.log(`✅ User "${email}" has been promoted to admin`);
    console.log(`   Name: ${user.nom}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);

    mongoose.connection.close();
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
