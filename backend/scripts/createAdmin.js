/**
 * Script to create a dedicated admin account
 * Usage: node scripts/createAdmin.js
 *
 * Default credentials (change after first login):
 * Email: admin@balsem.tn
 * Password: Admin@2026
 */

const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const adminData = {
  nom: 'Administrateur',
  prenom: 'Balsem',
  email: 'admin@balsem.tn',
  password: 'Admin@2026',
  role: 'admin'
};

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pfe_sans_gluten';

mongoose.connect(mongoUri)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    console.log('');
    console.log('🔐 Creating Admin Account...');
    console.log('');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email.toLowerCase() });

    if (existingAdmin) {
      console.log('⚠️  Admin account already exists!');
      console.log('');
      console.log('📧 Email:', adminData.email);
      console.log('🔑 Password: [Already Set]');

      // Ask if user wants to reset password
      console.log('');
      console.log('To reset the password, run:');
      console.log('  node scripts/resetAdmin.js <new-password>');
      mongoose.connection.close();
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminData.password, salt);

    // Create admin user
    const admin = new User({
      nom: adminData.nom,
      prenom: adminData.prenom,
      email: adminData.email.toLowerCase(),
      password: hashedPassword,
      role: adminData.role
    });

    await admin.save();

    console.log('✅ Admin account created successfully!');
    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📋 ADMIN CREDENTIALS');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');
    console.log('🌐 Admin URL:  http://192.168.1.17:5173/admin');
    console.log('🌐 Local URL:  http://localhost:5173/admin');
    console.log('');
    console.log('📧 Email:     ' + adminData.email);
    console.log('🔑 Password:  ' + adminData.password);
    console.log('');
    console.log('⚠️  IMPORTANT: Change the password after first login!');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');

    mongoose.connection.close();
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
