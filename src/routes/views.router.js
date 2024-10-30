const express = require("express");
const router = express.Router();
const ProductManager = require("../managers/product-manager.js");
const Product = require("../models/product.model.js");
const CartManager = require("../managers/cart-manager.js");
const cartManager = new CartManager("./src/data/carts.json");

// Ruta para ver productos
// En views.router.js o en el archivo controlador correspondiente
// Ruta para ver productos con paginación y filtros
router.get('/products', async (req, res) => {
  const { page = 1, limit = 10, sort, query } = req.query;
  const filter = query ? { title: { $regex: query, $options: 'i' } } : {};

  try {
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sort ? { price: sort } : {}
    };

    const result = await Product.paginate(filter, options);
    res.render('products', {
      payload: result.docs,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      totalPages: result.totalPages,
      page: result.page,
      limit
    });
  } catch (error) {
    res.status(500).send('Error al cargar los productos');
  }
});



// Ruta para ver un carrito específico
router.get("/carts/:cid", async (req, res) => {
  const carritoId = parseInt(req.params.cid);

  try {
    const carrito = await cartManager.getCarritoById(carritoId);
    res.render("carts", {
      cid: carritoId,
      productos: carrito.products 
    });
  } catch (error) {
    res.status(500).send("Error al obtener el carrito");
  }
});


// Ruta para la página principal
router.get('/', async (req, res) => {
  const { page = 1, limit = 10, sort, query } = req.query;
  const filter = query ? { title: { $regex: query, $options: 'i' } } : {};

  try {
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sort ? { price: sort } : {}
    };

    const result = await Product.paginate(filter, options);
    res.render('home', {
      products: result.docs,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      totalPages: result.totalPages,
      page: result.page,
      limit
    });
  } catch (error) {
    console.error(error); 
    res.status(500).send('Error al obtener los productos');
  }
});

module.exports = router;
