const User = require('../models/User');

const seedAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (!existingAdmin) {
      // Create default admin
      const admin = await User.create({
        name: 'Admin User',
        email: 'admin@hotelease.com',
        password: 'Admin@123',
        role: 'admin'
      });
      
      console.log('✅ Admin user created successfully');
      console.log('Email: admin@hotelease.com');
      console.log('Password: Admin@123');
    } else {
      console.log('✅ Admin user already exists');
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  }
};

module.exports = seedAdmin;