const fs = require('fs').promises;

class CartManager {
  constructor(cartsFile) {
    this.cartsFile = cartsFile;
    this.carts = [];
    this.loadCarts();
  }

  async loadCarts() {
    try {
      const fileContent = await fs.readFile(this.cartsFile, 'utf-8');
      this.carts = JSON.parse(fileContent);
    } catch (error) {
      console.error(`Error while reading carts file: ${error.message}`);
      throw error;
    }
  }

  async saveCarts() {
    try {
      await fs.writeFile(this.cartsFile, JSON.stringify(this.carts, null, 2));
    } catch (error) {
      console.error(`Error while saving carts file: ${error.message}`);
      throw error;
    }
  }

  getCarts() {
    return this.carts;
  }

  async getCartById(cartId) {
    const cart = this.carts.find(c => c.id === parseInt(cartId));
    if (!cart) {
      throw new Error(`Cart with id ${cartId} not found`);
    }
    return cart;
  }

  async addCart(products = []) {
    try {
      const carts = this.getCarts();
      const lastCart = carts[carts.length - 1];
      const newCartId = lastCart ? lastCart.id + 1 : 1;
      const newCart = { id: newCartId, products };
      carts.push(newCart);
      this.saveCarts(carts);
      return newCart;
    } catch (error) {
      throw new Error('Error al agregar el carrito');
    }
  }

  async addProductToCart(cartId, productId, quantity) {
    try {
      const cart = await this.getCartById(cartId);
      const productIndex = cart.products.findIndex(p => p.product === productId);
      if (productIndex === -1) {
        cart.products.push({ product: productId, quantity: 1 });
      } else {
        cart.products[productIndex].quantity += 1;
      }
      await this.updateCart(cart);
      return cart;
    } catch (error) {
      throw error;
    }
  }

  async updateCart(cart) {
    try {
      const index = this.carts.findIndex(c => c.id === cart.id);
      if (index === -1) {
        throw new Error(`Cart with id ${cart.id} not found`);
      }
      this.carts[index] = cart;
      await this.saveCarts();
    } catch (error) {
      console.error(error);
      throw new Error('Error al actualizar el carrito');
    }
  }
}  

module.exports = CartManager;
