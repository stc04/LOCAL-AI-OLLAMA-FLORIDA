const fs = require('fs').promises;
const path = require('path');

class FileDB {
  constructor(filename) {
    this.filename = path.join(__dirname, '..', 'data', filename);
    this.initializeFile();
  }

  async initializeFile() {
    try {
      await fs.access(this.filename);
    } catch (error) {
      // File doesn't exist, create it with empty array
      await fs.writeFile(this.filename, '[]');
    }
  }

  async readData() {
    try {
      const data = await fs.readFile(this.filename, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading data:', error);
      return [];
    }
  }

  async writeData(data) {
    try {
      await fs.writeFile(this.filename, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error writing data:', error);
      throw error;
    }
  }

  async findOne(query) {
    const data = await this.readData();
    return data.find(item => {
      return Object.keys(query).every(key => item[key] === query[key]);
    });
  }

  async findById(id) {
    const data = await this.readData();
    return data.find(item => item.id === id);
  }

  async create(item) {
    const data = await this.readData();
    const newItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    data.push(newItem);
    await this.writeData(data);
    return newItem;
  }

  async update(id, updates) {
    const data = await this.readData();
    const index = data.findIndex(item => item.id === id);
    if (index === -1) return null;
    
    data[index] = {
      ...data[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    await this.writeData(data);
    return data[index];
  }

  async delete(id) {
    const data = await this.readData();
    const filtered = data.filter(item => item.id !== id);
    await this.writeData(filtered);
  }
}

module.exports = FileDB;
