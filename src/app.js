const express = require('express');
const ProductManager = require('./ProductManager');

const app = express();
const port = 8080;

const productManager = new ProductManager('./products.json');
app.use(express.urlencoded({extended:true}))
app.get('/products', async (req, res) => {
  let limit = req.query.limit;
  let products = await productManager.getProducts();
  if (limit !== undefined && !isNaN(parseInt(limit))) {
    limit = parseInt(limit);
    products = products.slice(0, limit);
  } else if (limit !== undefined) {
    return res.status(400).send({ error: 'Limit must be a number' });
  }
  res.send({ products });
});

app.get('/products/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = await productManager.getProductById(productId);
    res.json({ product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, function (err) {
  if (err) console.error(err);
  console.info(`Server running on port ${port}`);
});
