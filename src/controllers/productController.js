import ProductManager from '../controllers/ProductManager.js';

const productManager = new ProductManager('products.json');

const productController = {};

productController.getAllProducts = async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.status(200).send({ status: 'OK', data: products });
  } catch (err) {
    res.status(500).send({ status: 'ERR', error: err });
  }
};

productController.getProductById = async (req, res) => {
  try {
    const product = await productManager.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).send({ status: 'OK', data: product });
  } catch (err) {
    res.status(500).send({ status: 'ERR', error: err });
  }
};

productController.addProduct = async (req, res) => {
  try {
    await productManager.addProduct(req.body);
    if (productManager.checkStatus() === 1) {
      res.status(200).send({ status: 'OK', msg: productManager.showStatusMsg() });
    } else {
      res.status(400).send({ status: 'ERR', error: productManager.showStatusMsg() });
    }
  } catch (err) {
    res.status(500).send({ status: 'ERR', error: err });
  }
};

productController.updateProduct = async (req, res) => {
  try {
    const { id, field, data } = req.body;
    await productManager.updateProduct(id, field, data);
    if (productManager.checkStatus() === 1) {
      res.status(200).send({ status: 'OK', msg: productManager.showStatusMsg() });
    } else {
      res.status(400).send({ status: 'ERR', error: productManager.showStatusMsg() });
    }
  } catch (err) {
    res.status(500).send({ status: 'ERR', error: err });
  }
};

productController.deleteProduct = async (req, res) => {
  try {
    await productManager.deleteProduct(req.params.id);
    if (productManager.checkStatus() === 1) {
      res.status(200).send({ status: 'OK', msg: productManager.showStatusMsg() });
    } else {
      res.status(400).send({ status: 'ERR', error: productManager.showStatusMsg() });
    }
  } catch (err) {
    res.status(500).send({ status: 'ERR', error: err });
  }
};

export default productController;
