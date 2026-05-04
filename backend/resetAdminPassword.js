const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb+srv://Sans-Gluten:UHasPG2UOxGmKEwM@sans-gluten.bf4h8e1.mongodb.net/?appName=Sans-Gluten')
  .then(async () => {
    const admin = await User.findOne({ role: 'admin' });
    if (admin) {
      const newPassword = 'admin123';
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      admin.password = hashedPassword;
      await admin.save();
      console.log('Admin password reset successfully!');
      console.log('Email:', admin.email);
      console.log('New password:', newPassword);
    } else {
      console.log('No admin user found');
    }
    mongoose.connection.close();
  })
  .catch(err => console.error('Error:', err));
