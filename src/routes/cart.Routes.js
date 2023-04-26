import { Router } from 'express';
import cartController from '../controllers/cartController.js';
import cartManager from '../controllers/cartManager.js';
import productManager from '../controllers/ProductManager.js';

const cartRouter = Router();

// Instancias de managers
const productManagerInstance = new productManager('./products.json');
const cartManagerInstance = new cartManager('./carts.json', productManagerInstance);

const cartRoutes = (router) => {
    cartRouter.get('/api/carts', cartController.getAllCarts);
    cartRouter.get('/api/carts/:cid', cartController.getCartById);
    cartRouter.post('/api/carts', cartController.addNewCart);
    cartRouter.post('/api/carts/add', cartController.addToCart);
    cartRouter.delete('/api/carts/remove', cartController.removeCart);
    cartRouter.post('/api/carts/:cid/product/:pid', cartController.addToCart);
}

export default cartRoutes;

