const express = require('express');
const router = express.Router();

const ProductManager = require('../controllers/ProductManager');

const productManagerInstance = new ProductManager('./products.json');

// Obtener todos los productos
router.get('/', async (req, res) => {
  let limit = req.query.limit;
  let products = await productManagerInstance.getProducts();
  if (limit !== undefined && !isNaN(parseInt(limit))) {
    limit = parseInt(limit);
    products = products.slice(0, limit);
  } else if (limit !== undefined) {
    return res.status(400).send({ error: 'Limit must be a number' });
  }
  res.send({ products });
});

// Obtener un producto por su id
router.get('/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = await productManagerInstance.getProductById(productId);
    res.json({ product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Agregar un nuevo producto
router.post('/', async (req, res) => {
  const { title, description, code, price, status, stock, category, thumbnails } = req.body;
  if (title === undefined || description === undefined || code === undefined || price === undefined || status === undefined || stock === undefined || category === undefined || thumbnails === undefined) {
    return res.status(400).send({ error: 'All fields are required' });
  }
  if (isNaN(parseFloat(price))) {
    return res.status(400).send({ error: 'Price must be a number' });
  }
  if (isNaN(parseInt(stock))) {
    return res.status(400).send({ error: 'Stock must be a number' });
  }
  if (typeof status !== 'boolean') {
    return res.status(400).send({ error: 'Status must be a boolean' });
  }
  if (!Array.isArray(thumbnails)) {
    return res.status(400).send({ error: 'Thumbnails must be an array' });
  }
  const newProduct = {
    title,
    description,
    code,
    price,
    status: status === undefined ? true : status,
    stock,
    category,
    thumbnails,
  };
  try { 
    const productId = await productManagerInstance.addProduct(newProduct);
    res.json({ productId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar un producto por su id
router.put('/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid);

  try {
    const updatedProduct = await productManagerInstance.updateProduct(productId, req.body);
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Eliminar un producto por su id
router.delete('/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid);
  try {
    await productManagerInstance.deleteProduct(productId);
    res.json({ productId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
