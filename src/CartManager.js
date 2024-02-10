// CartManager.js
const fs = require('fs').promises;

class CartManager {
  constructor(path) {
    this.path = path;
  }

  async getCartsFromFile() {
    try {
      const data = await fs.readFile(this.path, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error al leer el archivo de carritos:', error.message);
      return [];
    }
  }

  async saveCartsToFile(carts) {
    try {
      await fs.writeFile(this.path, JSON.stringify(carts, null, 2), 'utf8');
    } catch (error) {
      console.error('Error al escribir en el archivo de carritos:', error.message);
    }
  }

  async getCarts() {
    const carts = await this.getCartsFromFile();
    return carts;
  }

  async getCartById(cartId) {
    const carts = await this.getCartsFromFile();
    return carts.find(cart => cart.id === cartId);
  }

  async addCart(cartData) {
    const carts = await this.getCartsFromFile();
    const newCart = {
      id: carts.length + 1,
      products: [],
      ...cartData
    };
    carts.push(newCart);
    await this.saveCartsToFile(carts);
  }

  async updateCart(cartId, updatedData) {
    const carts = await this.getCartsFromFile();
    const cartIndex = carts.findIndex(cart => cart.id === cartId);

    if (cartIndex !== -1) {
      carts[cartIndex] = {
        ...carts[cartIndex],
        ...updatedData
      };
      await this.saveCartsToFile(carts);
    }
  }

  async deleteCart(cartId) {
    const carts = await this.getCartsFromFile();
    const updatedCarts = carts.filter(cart => cart.id !== cartId);
    await this.saveCartsToFile(updatedCarts);
  }
}

module.exports = CartManager;