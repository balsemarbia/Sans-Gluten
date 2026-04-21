/**
 * Script to reset admin password
 * Usage: node scripts/resetAdmin.js <new-password>
 */

const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const adminEmail = 'admin@balsem.tn';
const newPassword = process.argv[2];

if (!newPassword) {
  console.log('Usage: node scripts/resetAdmin.js <new-password>');
  console.log('Example: node scripts/resetAdmin.js NewSecure@123');
  process.exit(1);
}

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pfe_sans_gluten';

mongoose.connect(mongoUri)
  .then(async () => {
    console.log('✅ Connected to MongoDB');

    const admin = await User.findOne({ email: adminEmail.toLowerCase() });

    if (!admin) {
      console.log(`❌ Admin account not found. Run createAdmin.js first.`);
      mongoose.connection.close();
      process.exit(1);
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    admin.password = hashedPassword;
    await admin.save();

    console.log('✅ Admin password reset successfully!');
    console.log('');
    console.log('📧 Email:    ' + adminEmail);
    console.log('🔑 Password: ' + newPassword);
    console.log('');
    console.log('🌐 Login at: http://192.168.1.17:5173/admin');

    mongoose.connection.close();
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
