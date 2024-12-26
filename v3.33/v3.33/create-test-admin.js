const fs = require('fs').promises;
const path = require('path');

async function createTestAdmin() {
  try {
    // Use a pre-computed hash for 'admin123'
    const adminUser = {
      username: 'admin',
      email: 'admin@example.com',
      // This is the hash for 'admin123'
      password: '$2a$10$GKg/ISqwReyF1JxFGY8YgODz7GkYdkN5A4.h9VRED56Y9iFyXSNFi',
      role: 'admin',
      preferences: {
        theme: 'light',
        defaultModel: 'llama2'
      },
      id: '1234567890',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Ensure data directory exists
    const dataDir = path.join(__dirname, 'data');
    try {
      await fs.mkdir(dataDir);
    } catch (err) {
      if (err.code !== 'EEXIST') throw err;
    }

    // Save to users.json
    const usersFile = path.join(dataDir, 'users.json');
    await fs.writeFile(usersFile, JSON.stringify([adminUser], null, 2));

    console.log('Test admin user created successfully:');
    console.log('Email:', adminUser.email);
    console.log('Password: admin123');
    console.log('File saved to:', usersFile);
    
    // Verify the file was written
    const content = await fs.readFile(usersFile, 'utf8');
    console.log('\nFile contents:', content);

  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

// Run the function
createTestAdmin();
