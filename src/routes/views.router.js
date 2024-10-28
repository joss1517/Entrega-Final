const express = require("express");
const router = express.Router();
const ProductManager = require("../managers/product-manager.js");
const CartManager = require("../managers/cart-manager.js");
const productManager = new ProductManager("./src/data/products.json");
const cartManager = new CartManager("./src/data/carts.json");

// Ruta para ver productos
router.get("/products", async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const productos = await productManager.getProducts({ page, limit });
    res.render("products", {
      productos: productos.payload,
      totalPages: productos.totalPages,
      prevPage: productos.prevPage,
      nextPage: productos.nextPage,
      page: productos.page,
      hasPrevPage: productos.hasPrevPage,
      hasNextPage: productos.hasNextPage,
      limit
    });
  } catch (error) {
    res.status(500).send("Error al obtener productos");
  }
});

// Ruta para ver un carrito específico
router.get("/carts/:cid", async (req, res) => {
  const carritoId = parseInt(req.params.cid);

  try {
    const carrito = await cartManager.getCarritoById(carritoId);
    res.render("cart", {
      cid: carritoId,
      productos: carrito.products // Aquí debes hacer un populate si es necesario
    });
  } catch (error) {
    res.status(500).send("Error al obtener el carrito");
  }
});

module.exports = router;
