const express = require('express');
const app = express.Router();
const cartController = require('../controllers/cartController');
const cartManager = require('../controllers/cartManager');
const productManager = require('../controllers/ProductManager');
// Instancias de managers
const productManagerInstance = new productManager('./products.json');
const cartManagerInstance = new cartManager('./carts.json', productManagerInstance);
const cartRoutes = (app) => {
app.get('/api/carts', cartController.getAllCarts);
app.get('/api/carts/:cid', cartController.getCartById);
app.post('/api/carts', cartController.addNewCart);
app.post('/api/carts/add', cartController.addToCart);
app.delete('/api/carts/remove', cartController.removeCart);
app.post('/api/carts/:cid/product/:pid', cartController.addToCart);
}

module.exports = cartRoutes;
