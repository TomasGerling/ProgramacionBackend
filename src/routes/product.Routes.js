import { Router } from 'express';
const productRouter = Router();
import productController from '../controllers/productController.js';

productRouter.get('/products', productController.getAllProducts);
productRouter.get('/products/:id', productController.getProductById);
productRouter.post('/products', productController.addProduct);
productRouter.put('/products/:id', productController.updateProduct);
productRouter.delete('/products/:id', productController.deleteProduct);

export default productRouter;
