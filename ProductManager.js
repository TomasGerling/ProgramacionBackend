const fs = require("fs");

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  addProduct(product) {
    const products = this.getProducts();
    const lastProduct = products[products.length - 1];
    const newId = lastProduct ? lastProduct.id + 1 : 1;
    const newProduct = { ...product, id: newId };
    products.push(newProduct);
    this.saveProducts(products);
    return newProduct;
  }

  getProducts() {
    const fileData = fs.readFileSync(this.path, "utf-8");
    return fileData ? JSON.parse(fileData) : [];
  }

  getProductById(id) {
    const products = this.getProducts();
    const product = products.find((p) => p.id === id);
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }
    return product;
  }

  updateProduct(id, updates) {
    const products = this.getProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Product with id ${id} not found`);
    }
    const updatedProduct = { ...products[index], ...updates, id };
    products[index] = updatedProduct;
    this.saveProducts(products);
    return updatedProduct;
  }

  deleteProduct(id) {
    const products = this.getProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Product with id ${id} not found`);
    }
    const deletedProduct = products.splice(index, 1)[0];
    this.saveProducts(products);
    return deletedProduct;
  }

  saveProducts(products) {
    fs.writeFileSync(this.path, JSON.stringify(products));
  }
}

// // Testing
// const productManager = new ProductManager("products.json");

// // Test addProduct and getProducts
// console.log(productManager.getProducts()); // []

// const newProduct = {
//   title: "producto prueba",
//   description: "Este es un producto prueba",
//   price: 200,
//   thumbnail: "Sin imagen",
//   code: "abc123",
//   stock: 25,
// };

// const addedProduct = productManager.addProduct(newProduct);
// console.log(addedProduct); // { id: 1, ...newProduct }

// console.log(productManager.getProducts()); // [ { id: 1, ...newProduct } ]

// // Test getProductById
// const foundProduct = productManager.getProductById(1);
// console.log(foundProduct); // { id: 1, ...newProduct }

// try {
//   productManager.getProductById(2);
// } catch (error) {
//   console.log(error.message); // Product with id 2 not found
// }

// // Test updateProduct
// const updates = { title: "Nuevo título" };
// const updatedProduct = productManager.updateProduct(1, updates);
// console.log(updatedProduct); // { id: 1, ...newProduct, title: "Nuevo título" }

// try {
//   productManager.updateProduct(2, updates);
// } catch (error) {
//   console.log(error.message); // Product with id 2 not found
// }

// // Test deleteProduct
// const deletedProduct = productManager.deleteProduct(1);
// console.log(deletedProduct); // { id: 1, ...newProduct, title: "Nuevo título" }

// try {
//   productManager.deleteProduct(2);
// } catch (error) {
//   console.log(error.message); // Product with id 2 not found
// }

// console.log(productManager.getProducts()); // []
