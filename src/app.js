const express = require('express');
const productRouter = require('./routes/products.router.js');
const cartRouter = require('./routes/carts.router.js');
const viewsRouter = require('./routes/views.router.js');
const exphbs = require('express-handlebars');
const socket = require('socket.io');
const mongoose = require('mongoose');

// Conexión a MongoDB
mongoose.connect("mongodb+srv://ipunto09:coderhouse@cluster0.35esf.mongodb.net/ProyectoFinal?retryWrites=true&w=majority&appName=Cluster0",)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

const app = express();
const PUERTO = 8081;

// Configuración de middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

// Configuración de Handlebars
app.engine("handlebars", exphbs.engine());
app.engine('handlebars', hbs({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  }
}));
app.set("view engine", "handlebars");
app.set('views', './src/views');

// Configuración de rutas
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use('/', viewsRouter);

// Iniciar servidor HTTP
const httpServer = app.listen(PUERTO, () => {
  console.log(`Escuchando en el http://localhost:${PUERTO}`);
});

// Configuración de Socket.IO
const ProductManager = require('./managers/product-manager.js');
const manager = new ProductManager('./src/data/products.json');
const io = socket(httpServer);

io.on('connection', async (socket) => {
  console.log('Un cliente se conectó');

  // Emitir productos al nuevo cliente conectado
  socket.emit('products', await manager.getProducts());

  // Escuchar eventos de agregar producto
  socket.on('nuevoProducto', async (producto) => {
    await manager.addProduct(producto);
    const productosActualizados = await manager.getProducts();
    io.emit('products', productosActualizados); // Actualizar todos los clientes
  });

  // Escuchar eventos de eliminar producto
  socket.on('eliminarProducto', async (id) => {
    await manager.deleteProduct(id);
    const productosActualizados = await manager.getProducts();
    io.emit('products', productosActualizados); // Actualizar todos los clientes
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal!');
});
