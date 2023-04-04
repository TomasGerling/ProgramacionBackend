const fs = require('fs');

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async addProduct(product) {
    const products = await this.getProducts();
    const newProduct = { ...product, id: products.length + 1 };
    products.push(newProduct);
    await this.saveProducts(products);
    return newProduct;
  }

  async getProducts() {
    try {
      const products = await fs.promises.readFile(this.path, 'utf-8');
      return JSON.parse(products);
    } catch (error) {
      if (error.code === 'ENOENT') {
        await this.saveProducts([]);
        return [];
      }
      throw error;
    }
  }

  async getProductById(id) {
    const products = await this.getProducts();
    const product = products.find((p) => p.id === id);
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }
    return product;
  }

  async updateProduct(id, productToUpdate) {
    const products = await this.getProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Product with id ${id} not found`);
    }
    const updatedProduct = { ...products[index], ...productToUpdate };
    products.splice(index, 1, updatedProduct);
    await this.saveProducts(products);
    return updatedProduct;
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Product with id ${id} not found`);
    }
    products.splice(index, 1);
    await this.saveProducts(products);
  }

  async saveProducts(products) {
    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
  }
}

module.exports = ProductManager;