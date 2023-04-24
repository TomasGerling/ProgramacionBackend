const products = [];

function getAllProducts(req, res) {
  res.json(products);
}

function getProductById(req, res) {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
}

function addProduct(req, res) {
  const { name, price } = req.body;
  const id = products.length + 1;
  const newProduct = { id, name, price };
  products.push(newProduct);
  res.json(newProduct);
}

function updateProduct(req, res) {
  const productIndex = products.findIndex(p => p.id === req.params.id);
  if (productIndex < 0) {
    return res.status(404).json({ error: 'Product not found' });
  }
  const { name, price } = req.body;
  products[productIndex].name = name;
  products[productIndex].price = price;
  res.json(products[productIndex]);
}

function deleteProduct(req, res) {
  const productIndex = products.findIndex(p => p.id === req.params.id);
  if (productIndex < 0) {
    return res.status(404).json({ error: 'Product not found' });
  }
  const deletedProduct = products.splice(productIndex, 1)[0];
  res.json(deletedProduct);
}

module.exports = {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct
};
