const express = require("express");
const router = express.Router();
const Product = require("../models/product.model.js"); // Asegúrate de que la ruta al modelo sea correcta

// Obtener productos con paginación y filtros
router.get("/", async (req, res) => {
  const { limit = 10, page = 1, sort, query, category, available } = req.query;
  const limitNum = parseInt(limit);
  const pageNum = parseInt(page);

  try {
    let queryObject = {};

    // Filtrar productos por nombre (query), categoría y disponibilidad
    if (query) {
      queryObject.title = { $regex: query, $options: "i" }; // Filtrar por título
    }
    if (category) {
      queryObject.category = category; // Filtrar por categoría
    }
    if (available !== undefined) {
      queryObject.available = available === 'true'; // Filtrar por disponibilidad
    }

    // Obtener productos con paginación y ordenamiento
    let arrayProductos = await Product.find(queryObject)
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum)
      .sort(sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {})
      .exec();

    const total = await Product.countDocuments(queryObject); // Total de productos filtrados
    const totalPages = Math.ceil(total / limitNum);

    // Respuesta JSON con paginación y enlaces
    res.json({
      status: 'success',
      payload: arrayProductos,
      totalPages,
      prevPage: pageNum > 1 ? pageNum - 1 : null,
      nextPage: pageNum < totalPages ? pageNum + 1 : null,
      page: pageNum,
      hasPrevPage: pageNum > 1,
      hasNextPage: pageNum < totalPages,
      prevLink: pageNum > 1 ? `/api/products?limit=${limitNum}&page=${pageNum - 1}&sort=${sort || ''}&query=${query || ''}&category=${category || ''}&available=${available || ''}` : null,
      nextLink: pageNum < totalPages ? `/api/products?limit=${limitNum}&page=${pageNum + 1}&sort=${sort || ''}&query=${query || ''}&category=${category || ''}&available=${available || ''}` : null,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: "Error del servidor" });
  }
});

// Obtener producto por ID
router.get("/:pid", async (req, res) => {
  const id = req.params.pid;

  try {
    const productoBuscado = await Product.findById(id);

    if (!productoBuscado) {
      res.status(404).json({ status: 'error', message: "Producto no encontrado" });
    } else {
      res.json({ status: 'success', payload: productoBuscado });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: "Error del servidor" });
  }
});

// Agregar nuevo producto
router.post("/", async (req, res) => {
  const nuevoProducto = req.body;

  try {
    const productoCreado = await Product.create(nuevoProducto);
    res.status(201).json({ status: 'success', payload: productoCreado });
  } catch (error) {
    res.status(500).json({ status: 'error', message: "Error del servidor" });
  }
});

// Actualizar producto por ID
router.put("/:pid", async (req, res) => {
  const id = req.params.pid;
  const productoActualizado = req.body;

  try {
    const producto = await Product.findByIdAndUpdate(id, productoActualizado, { new: true });

    if (!producto) {
      return res.status(404).json({ status: 'error', message: "Producto no encontrado" });
    }
    res.json({ status: 'success', payload: producto });
  } catch (error) {
    res.status(500).json({ status: 'error', message: "Error del servidor" });
  }
});

// Eliminar producto por ID
router.delete("/:pid", async (req, res) => {
  const id = req.params.pid;

  try {
    const productoEliminado = await Product.findByIdAndDelete(id);

    if (!productoEliminado) {
      return res.status(404).json({ status: 'error', message: "Producto no encontrado" });
    }
    res.json({ status: 'success', message: "Producto eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ status: 'error', message: "Error del servidor" });
  }
});

module.exports = router;
