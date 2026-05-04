const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pfe_sans_gluten')
  .then(async () => {
    const admin = await User.findOne({ role: 'admin' });
    if (admin) {
      console.log('Admin found:', admin.email);
      console.log('Admin ID:', admin._id);
      console.log('Admin nom:', admin.nom);
    } else {
      console.log('No admin user found');
    }
    mongoose.connection.close();
  })
  .catch(err => console.error('Error:', err));
