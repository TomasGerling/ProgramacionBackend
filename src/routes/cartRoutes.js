const express = require('express');
const cartRoutes = express.Router();
const cartManager = require('../controllers/cartManager');
const  productManager = require('../controllers/ProductManager');

// Instancias de managers
const productManagerInstance = new productManager('./products.json');
const cartManagerInstance = new cartManager('./carts.json', productManagerInstance);

// Endpoint para obtener un carrito por ID
cartRoutes.get('/:cid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartManagerInstance.getCartById(cartId);
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(404).send('Error al obtener el carrito');
  }
});

// Endpoint para agregar un carrito
cartRoutes.post('/', async (req, res) => {
  try {
    const cart = await cartManagerInstance.addCart();
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al agregar el carrito');
  }
});

// Endpoint para agregar un producto a un carrito
cartRoutes.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = parseInt(req.params.pid);
    const quantity = parseInt(req.body.quantity);

    const cart = await cartManagerInstance.addProductToCart(cartId, productId, quantity);

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al agregar el producto al carrito');
  }
});

module.exports = cartRoutes;
