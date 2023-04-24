const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const ProductManager = require('../controllers/ProductManager');

const productManager = new ProductManager('products.json');

const productRoutes = (app) => {
router.get('/products', productController.getAllProducts);
router.get('/products/:id', productController.getProductById);
router.post('/products', productController.addProduct);
router.put('/products/:id', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);
}

module.exports = productRoutes;