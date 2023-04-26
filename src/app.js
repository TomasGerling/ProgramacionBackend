import express from 'express';
import expressHandlebars from 'express-handlebars';
import { Server } from "socket.io";
import productRoutes from './routes/product.Routes.js';
import cartRoutes from './routes/cart.Routes.js';
import path from 'path';
import { engine } from 'express-handlebars';
import fs from 'fs'
import { __dirname, __filename } from '../utils.js';

const PORT = 3000;
const WS_PORT = 3050;

// Servidor Express base
const server = express();
const httpServer = server.listen(WS_PORT, () => {
    console.log(`Servidor socketio iniciado en puerto ${WS_PORT}`);
});
const io = new Server(httpServer, { cors: { origin: "http://localhost:3000" }});

// Configuración de Handlebars
server.engine('handlebars', expressHandlebars.engine);
server.set('view engine', 'handlebars');
server.set('views','./views');

server.listen(PORT, () => {
  console.log(`Servidor base API / static iniciado en puerto ${PORT}`);
});

// Configuración del body-parser
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

// Configuración de las rutas
server.use('/api', productRoutes);
server.use('/api', cartRoutes);

// Motor de plantillas
server.engine('handlebars', engine());
server.set('view engine', 'handlebars');
server.set('views', './views');

// Configuración de la vista index
server.get('/index', (req, res) => {
    res.render('index');
});

// Ruta para la página de inicio
server.get('/', (req, res) => {
  // Cargamos los productos desde products.json
  const products = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'products.json'), 'utf-8'));
  
  // Renderizamos el archivo index.handlebars y pasamos los datos de los productos
  res.render('index', { products });
});
// Configuración de la vista realTimeProducts
server.get('/realTimeProducts', function (req, res) {
  const products = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'products.json'), 'utf-8'));
    res.render('realTimeProducts',  { products });
});

// Eventos socket.io
// Manejador de eventos de conexión de Socket.IO
io.on('connection', (socket) => {
  console.log('Un cliente se ha conectado');

  // Manejador de eventos para agregar productos
  socket.on('add_product', (newProduct) => {
    // Agregar el producto a la lista de productos
    products.push(newProduct);

    // Emitir un evento a todos los clientes conectados para que actualicen la lista de productos
    io.emit('update_products', products);
  });

  // Manejador de eventos para eliminar productos
  socket.on('delete_product', (productId) => {
    // Eliminar el producto de la lista de productos
    products = products.filter((product) => product.id !== productId);

    // Emitir un evento a todos los clientes conectados para que actualicen la lista de productos
    io.emit('update_products', products);
  });

  // Manejador de eventos de desconexión de Socket.IO
  socket.on('disconnect', () => {
    console.log('Un cliente se ha desconectado');
  });

  // Escuchamos por el evento evento_cl01 desde el cliente
  socket.on('event_cl01', (data) => {
      console.log(data);
  });
});

// Lista de productos
let products = [];

