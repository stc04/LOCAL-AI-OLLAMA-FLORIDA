const bcrypt = require('bcryptjs');
const FileDB = require('./FileDB');

class UserModel {
  constructor() {
    this.db = new FileDB('users.json');
    this.createAdminUser(); // Create default admin user if not exists
  }

  async createAdminUser() {
    try {
      const adminExists = await this.findByEmail('admin@example.com');
      if (!adminExists) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);
        
        await this.db.create({
          username: 'admin',
          email: 'admin@example.com',
          password: hashedPassword,
          role: 'admin',
          preferences: {
            theme: 'light',
            defaultModel: 'llama2'
          }
        });
        console.log('Admin user created successfully');
      }
    } catch (error) {
      console.error('Error creating admin user:', error);
    }
  }

  async findByEmail(email) {
    try {
      return await this.db.findOne({ email: email.toLowerCase() });
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  }

  async findById(id) {
    try {
      return await this.db.findById(id);
    } catch (error) {
      console.error('Error finding user by id:', error);
      return null;
    }
  }

  async create(userData) {
    try {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      // Create user
      const user = await this.db.create({
        username: userData.username,
        email: userData.email.toLowerCase(),
        password: hashedPassword,
        role: 'user',
        preferences: {
          theme: 'light',
          defaultModel: 'llama2'
        }
      });

      // Remove password from returned user object
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async comparePassword(user, candidatePassword) {
    try {
      return await bcrypt.compare(candidatePassword, user.password);
    } catch (error) {
      console.error('Error comparing passwords:', error);
      return false;
    }
  }

  async updatePreferences(userId, preferences) {
    try {
      const user = await this.findById(userId);
      if (!user) return null;

      const updatedUser = await this.db.update(userId, {
        preferences: {
          ...user.preferences,
          ...preferences
        }
      });

      const { password, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword;
    } catch (error) {
      console.error('Error updating preferences:', error);
      return null;
    }
  }

  async updateLastLogin(userId) {
    try {
      return await this.db.update(userId, {
        lastLogin: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating last login:', error);
      return null;
    }
  }
}

// Export a singleton instance
module.exports = new UserModel();
