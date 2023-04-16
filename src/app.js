const express = require('express');
const ProductManager = require('./controllers/ProductManager');
const cartManager = require('./controllers/cartManager');
const bodyParser = require('body-parser');
const app = express();
const port = 8080;

const productManagerInstance = new ProductManager('./products.json');
const cartManagerInstance = new cartManager('./carts.json', productManagerInstance);
const productManager = new ProductManager('products.json');

app.use(express.urlencoded({extended:true}))
app.use(bodyParser.json())

app.get('/', async (req, res) => {
  res.send('Aca todavia no hay nada, te recomiendo hacer click <a href="http:ocalhost:8080/products">Aca para ver todos los productos</a> o <a href="http:ocalhost:8080/products?limit=5">Aca para ver solo 5 productos</a> ')
})

app.get('/api/products', async (req, res) => {
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

app.get('/api/products/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = await productManager.getProductById(productId);
    res.json({ product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/products', async (req, res) => {
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
    const productId = await productManager.addProduct(newProduct);
    res.json({ productId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.put('/api/products/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid);

  try {
    const updatedProduct = await productManager.updateProduct(productId, req.body);
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/products/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid);
  try {
    await productManager.deleteProduct(productId);
    res.json({ productId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/carts/:cid', async (req, res) => {
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
app.post('/api/carts', async (req, res) => {
  try {
    const cart = await cartManagerInstance.addCart();
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al agregar el carrito');
  }
});

app.post('/api/carts/:cid/product/:pid', async (req, res) => {
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

app.listen(port, function (err) {
  if (err) console.error(err);
  console.info(`Server running on port ${port}`);
});
