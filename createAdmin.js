const mongoose = require('./db');
const User = require('./models/user');

async function createAdmin() {
  try {
    console.log('🔐 Creating admin user...');
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ username: 'Nikhil2004' });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      process.exit(0);
    }
    
    // Create admin user
    const admin = new User({
      username: 'Nikhil2004',
      email: 'admin@shophub.com',
      password: 'Nikhil123@',
      role: 'admin'
    });
    
    await admin.save();
    console.log('✅ Admin user created successfully!');
    console.log('📌 Username: Nikhil2004');
    console.log('📌 Password: Nikhil123@');
    console.log('📌 Access admin panel at: http://localhost:3000/admin');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
}

// Wait for MongoDB connection
setTimeout(() => {
  createAdmin();
}, 2000);
