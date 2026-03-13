require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas...');

    // Optionally remove existing first to be sure it's clean
    await User.deleteOne({ email: 'admin@chocodelight.com' });
    console.log('Cleared any existing admin user...');

    const admin = await User.create({
      email: 'admin@chocodelight.com',
      password: 'password123',
      role: 'admin'
    });

    console.log('Successfully created admin user:');
    console.log(admin);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
};

seedAdmin();
