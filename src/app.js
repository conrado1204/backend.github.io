const express = require('express');
const http = require('http');
const path = require('path');
const exphbs = require('express-handlebars');
const socketIO = require('socket.io');
const ProductManager = require('./ProductManager');
const CartManager = require('./CartManager');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const productManager = new ProductManager(path.join(__dirname, 'productos.txt'));
const cartManager = new CartManager(path.join(__dirname, 'carrito.json'));

// Configuración de Handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Rutas HTTP
app.get('/', async (req, res) => {
  const products = await productManager.getProducts();
  res.render('home', { products });
});

app.get('/realtimeproducts', async (req, res) => {
  const products = await productManager.getProducts();
  res.render('realTimeProducts', { products });
});

// Websockets
io.on('connection', (socket) => {
  console.log('Usuario conectado');

  // Evento para recibir nuevos productos desde la vista con websockets
  socket.on('newProduct', async (newProduct) => {
    // Agregar el nuevo producto
    await productManager.addProduct(newProduct);

    // Enviar la lista actualizada a todas las conexiones
    const updatedProducts = await productManager.getProducts();
    io.emit('updateProducts', updatedProducts);
  });

  // Evento para eliminar productos desde la vista con websockets
  socket.on('deleteProduct', async (productId) => {
    // Eliminar el producto
    await productManager.deleteProduct(productId);

    // Enviar la lista actualizada a todas las conexiones
    const updatedProducts = await productManager.getProducts();
    io.emit('updateProducts', updatedProducts);
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});

// Iniciar el servidor
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
