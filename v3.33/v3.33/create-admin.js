const bcrypt = require('bcryptjs');
const fs = require('fs').promises;
const path = require('path');

async function createAdminUser() {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    const adminUser = {
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      preferences: {
        theme: 'light',
        defaultModel: 'llama2'
      },
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Write to users.json
    const usersFile = path.join(__dirname, 'data', 'users.json');
    await fs.writeFile(usersFile, JSON.stringify([adminUser], null, 2));

    console.log('Admin user created successfully');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
    console.log('Hashed password:', hashedPassword);
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

createAdminUser();
