const express = require("express");
const router = express.Router();
const CartManager = require("../managers/cart-manager.js");

const cartManager = new CartManager();

router.post("/", async (req, res) => {
  try {
    const nuevoCarrito = await cartManager.crearCarrito();
    res.status(201).json(nuevoCarrito);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:cid", async (req, res) => {
  const carritoId = parseInt(req.params.cid);
  try {
    const carritoBuscado = await cartManager.getCarritoById(carritoId);
    res.json(carritoBuscado);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.post('/:cid/products', async (req, res) => {
  const cartId = parseInt(req.params.cid);
  const productId = req.body.productId;

  try {
    const updatedCart = await cartManager.agregarProductoAlCarrito(cartId, productId);
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: 'Hubo un problema al agregar el producto al carrito' });
  }
});

router.delete('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  try {
    await cartManager.eliminarProductoDelCarrito(cid, pid);
    res.status(204).send();
  } catch (error) {
    res.status(500).send('Error al eliminar producto del carrito');
  }
});

router.put('/:cid', async (req, res) => {
  const { cid } = req.params;
  const products = req.body;
  try {
    await cartManager.actualizarCarrito(cid, products);
    res.status(200).send('Carrito actualizado');
  } catch (error) {
    res.status(500).send('Error al actualizar el carrito');
  }
});

router.put('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body; 
  try {
    await cartManager.actualizarCantidadProducto(cid, pid, quantity);
    res.status(200).send('Cantidad actualizada');
  } catch (error) {
    res.status(500).send('Error al actualizar la cantidad del producto');
  }
});

router.delete('/:cid', async (req, res) => {
  const { cid } = req.params;
  try {
    await cartManager.eliminarTodoDelCarrito(cid);
    res.status(204).send(); 
  } catch (error) {
    res.status(500).send('Error al vaciar el carrito');
  }
});

// Obtener todos los carritos
router.get("/", async (req, res) => {
  try {
    const carritos = await cartManager.todosLosCarritos(); 
    res.json(carritos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
