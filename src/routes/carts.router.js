const express = require("express");
const CartManager = require("../managers/cart-manager.js"); // Ajusta la ruta según tu estructura de archivos
const router = express.Router();

const cartManager = new CartManager(); // Instancia de CartManager

// Crear un nuevo carrito
router.post("/", async (req, res) => {
  try {
    const nuevoCarrito = await cartManager.crearCarrito();
    res.status(201).json(nuevoCarrito); // Respuesta 201 para recurso creado
  } catch (error) {
    res.status(500).json({ error: error.message }); // Respuesta 500 para errores internos
  }
});

// Obtener un carrito por ID
router.get("/:cid", async (req, res) => {
  const carritoId = parseInt(req.params.cid);
  try {
    const carritoBuscado = await cartManager.getCarritoById(carritoId);
    res.json(carritoBuscado);
  } catch (error) {
    res.status(404).json({ error: error.message }); // Respuesta 404 si no se encuentra el carrito
  }
});

// Agregar un producto al carrito
router.post("/:cid/products/:pid", async (req, res) => {
  const carritoId = parseInt(req.params.cid);
  const productoId = req.params.pid;
  const quantity = req.body.quantity || 1;

  try {
    const carritoActualizado = await cartManager.agregarProductoAlCarrito(carritoId, productoId, quantity);
    res.json(carritoActualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar un producto del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
  const carritoId = parseInt(req.params.cid);
  const productoId = req.params.pid;

  try {
    const carritoActualizado = await cartManager.eliminarProductoDelCarrito(carritoId, productoId);
    res.json(carritoActualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar carrito con un arreglo de productos
router.put("/:cid", async (req, res) => {
  const carritoId = parseInt(req.params.cid);
  const productos = req.body;

  try {
    const carritoActualizado = await cartManager.actualizarCarrito(carritoId, productos);
    res.json(carritoActualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar la cantidad de un producto en el carrito
router.put("/:cid/products/:pid", async (req, res) => {
  const carritoId = parseInt(req.params.cid);
  const productoId = req.params.pid;
  const quantity = req.body.quantity;

  try {
    const carritoActualizado = await cartManager.actualizarCantidadProducto(carritoId, productoId, quantity);
    res.json(carritoActualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar todos los productos del carrito
router.delete("/:cid", async (req, res) => {
  const carritoId = parseInt(req.params.cid);

  try {
    const carritoVacio = await cartManager.eliminarTodoDelCarrito(carritoId);
    res.json(carritoVacio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
