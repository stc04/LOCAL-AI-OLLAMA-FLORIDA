const FileDB = require('./FileDB');

class ModelStore {
  constructor() {
    this.db = new FileDB('models.json');
  }

  async findAll() {
    return this.db.readData();
  }

  async findOne(query) {
    return this.db.findOne(query);
  }

  async findById(id) {
    return this.db.findById(id);
  }

  async create(modelData) {
    return this.db.create({
      ...modelData,
      status: 'available',
      metadata: {
        architecture: modelData.architecture || 'unknown',
        format: modelData.format || 'gguf',
        family: modelData.family || 'llama',
        parameters: modelData.parameters || 0,
        quantization: modelData.quantization || 'none'
      }
    });
  }

  async update(id, updates) {
    return this.db.update(id, updates);
  }

  async findByName(name) {
    const models = await this.db.readData();
    return models.find(model => model.name === name);
  }

  async deleteByName(name) {
    const model = await this.findByName(name);
    if (!model) return null;
    return this.db.delete(model.id);
  }

  async search(query) {
    const models = await this.db.readData();
    return models.filter(model => {
      const searchStr = query.toLowerCase();
      return (
        model.name.toLowerCase().includes(searchStr) ||
        model.description?.toLowerCase().includes(searchStr) ||
        model.metadata?.family.toLowerCase().includes(searchStr)
      );
    });
  }
}

module.exports = new ModelStore();
