const express = require('express');
const expressHandlebars = require('express-handlebars');
const server = express();
const http = require('http').createServer(server);
const { Server } = require("socket.io");
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const dirname = require('path').resolve();

const port = 3000;
const WS_PORT = 3050;


// Configuración de Handlebars
server.engine('handlebars', expressHandlebars.engine);
server.set('view engine', 'handlebars');
server.set('views', './views');

// Configuración de los archivos estáticos
server.use('/public', express.static(`${dirname}/public`));

// Configuración del body-parser
server.use(express.urlencoded({extended:true}));
server.use(express.json());

// Configuración de las rutas
server.use(productRoutes);
server.use(cartRoutes);

// Configuración de la vista home
server.get('/', (req, res) => {
  res.render('home');
});

// Configuración de la vista realTimeProducts
server.get('/realTimeProducts', function(req, res) {
  res.render('realTimeProducts');
});

// Configuración del servidor HTTP y WebSocket
const httpServer = http.listen(port, () => {
  console.log(`Servidor HTTP iniciado en puerto ${port}`);
});
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
}
});

// Configuración de la conexión con Socket.io
io.on('connection', socket => {
  console.log(`Cliente conectado (${socket.id})`);
  
  // Emitimos el evento server_confirm
  socket.emit('server_confirm', 'Conexión del cliente recibida');
  
  socket.on("disconnect", (reason) => {
    console.log(`Cliente desconectado (${socket.id}): ${reason}`);
});
  // Evento para enviar la lista de productos a la vista realTimeProducts
  socket.on('getProducts', () => {
    io.emit('updateProducts', products);
  });

  // Evento para crear un nuevo producto y enviar la nueva lista a la vista realTimeProducts
  socket.on('createProduct', product => {
    products.push(product);
    io.emit('updateProducts', products);
  });

  // Evento para eliminar un producto y enviar la nueva lista a la vista realTimeProducts
  socket.on('deleteProduct', productId => {
    products = products.filter(product => product.id !== productId);
    io.emit('updateProducts', products);
  });

  socket.on('event_cl01', (data) => {
    console.log(data);
});
});

// Lista de productos
let products = [];

// Inicialización del servidor
server.listen(WS_PORT, () => {
  console.log(`Servidor WebSocket iniciado en puerto ${WS_PORT}`);
});
