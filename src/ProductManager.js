const fs = require('fs').promises;

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async getProductsFromFile() {
    try {
      const data = await fs.readFile(this.path, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error al leer el archivo:', error.message);
      return [];
    }
  }

  async saveProductsToFile(products) {
    try {
      await fs.writeFile(this.path, JSON.stringify(products, null, 2), 'utf8');
    } catch (error) {
      console.error('Error al escribir en el archivo:', error.message);
    }
  }

  async getProducts() {
    const products = await this.getProductsFromFile();
    return products;
  }

  async getProductById(productId) {
    const products = await this.getProductsFromFile();
    return products.find(product => product.id === productId);
  }

  async addProduct(productData, io) {
    const products = await this.getProductsFromFile();
    const newProduct = {
      id: products.length + 1,
      ...productData
    };
    products.push(newProduct);
    await this.saveProductsToFile(products);
    this.emitUpdateProducts(io);
  }

  async updateProduct(productId, updatedData, io) {
    const products = await this.getProductsFromFile();
    const productIndex = products.findIndex(product => product.id === productId);

    if (productIndex !== -1) {
      products[productIndex] = {
        ...products[productIndex],
        ...updatedData
      };
      await this.saveProductsToFile(products);
      this.emitUpdateProducts(io);
    }
  }

  async deleteProduct(productId, io) {
    const products = await this.getProductsFromFile();
    const updatedProducts = products.filter(product => product.id !== productId);
    await this.saveProductsToFile(updatedProducts);
    this.emitUpdateProducts(io);
  }

  // Método para emitir eventos de socket con los productos actualizados
  static emitUpdateProducts(io) {
    io.emit('updateProducts', this.getProducts());
  }
}

module.exports = ProductManager;
