const express = require("express");
const router = express.Router();
const ProductManager = require("../managers/product-manager.js");
const manager = new ProductManager("./src/data/products.json");

router.get("/", async (req, res) => {
  const { limit = 10, page = 1, sort, query, category, available } = req.query; // Obtener los parámetros de consulta
  const limitNum = parseInt(limit); // Convertir limit a número
  const pageNum = parseInt(page); // Convertir page a número

  try {
    let arrayProductos = await manager.getProducts(); // Obtener todos los productos

    // Filtrar productos si hay un query
    if (query) {
      arrayProductos = arrayProductos.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) // Filtrar por nombre
      );
    }

    // Filtrar por categoría si hay un category
    if (category) {
      arrayProductos = arrayProductos.filter(product =>
        product.category && product.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filtrar por disponibilidad si hay un available
    if (available !== undefined) { // Comprobar que 'available' no sea undefined
      const isAvailable = available === 'true'; // Convertir a boolean
      arrayProductos = arrayProductos.filter(product => product.available === isAvailable);
    }

    // Ordenar productos si hay un sort
    if (sort === 'asc') {
      arrayProductos.sort((a, b) => a.price - b.price); // Ordenar ascendente por precio
    } else if (sort === 'desc') {
      arrayProductos.sort((a, b) => b.price - a.price); // Ordenar descendente por precio
    }

    // Implementar paginación
    const total = arrayProductos.length; // Total de productos filtrados
    const totalPages = Math.ceil(total / limitNum); // Total de páginas
    const startIndex = (pageNum - 1) * limitNum; // Índice inicial para la paginación
    const endIndex = startIndex + limitNum; // Índice final para la paginación
    const paginatedProducts = arrayProductos.slice(startIndex, endIndex); // Productos de la página actual

    // Respuesta JSON con detalles de paginación
    res.json({
      status: 'success',
      payload: paginatedProducts,
      totalPages,
      prevPage: pageNum > 1 ? pageNum - 1 : null,
      nextPage: pageNum < totalPages ? pageNum + 1 : null,
      page: pageNum,
      hasPrevPage: pageNum > 1,
      hasNextPage: pageNum < totalPages,
      prevLink: pageNum > 1 ? `http://localhost:8080/api/products?limit=${limitNum}&page=${pageNum - 1}&sort=${sort || ''}&query=${query || ''}&category=${category || ''}&available=${available || ''}` : null,
      nextLink: pageNum < totalPages ? `http://localhost:8080/api/products?limit=${limitNum}&page=${pageNum + 1}&sort=${sort || ''}&query=${query || ''}&category=${category || ''}&available=${available || ''}` : null,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: "Error del servidor" });
  }
});

router.get("/:pid", async (req, res) => {
  let id = req.params.pid;

  try {
    const productoBuscado = await manager.getProductById(parseInt(id));

    if (!productoBuscado) {
      res.send("Producto no encontrado");
    } else {
      res.send(productoBuscado);
    }

  } catch (error) {
    res.status(500).send("Error del servidor");
  }
});

router.post("/", async (req, res) => {
  const nuevoProducto = req.body;

  try {
    await manager.addProduct(nuevoProducto);
    const productosActualizados = await manager.getProducts();
    io.emit('products', productosActualizados);
    res.status(201).send("Producto agregado exitosamente");
  } catch (error) {
    res.status(500).send("Error del servidor");
  }
});

router.put("/:pid", async (req, res) => {
  const id = parseInt(req.params.pid);
  const productoActualizado = req.body;

  try {
    await manager.updateProduct(id, productoActualizado);
    res.send("Producto actualizado exitosamente");
  } catch (error) {
    res.status(500).send("Error del servidor");
  }
});

router.delete("/:pid", async (req, res) => {
  const id = parseInt(req.params.pid);

  try {
    await manager.deleteProduct(id);
    const productosActualizados = await manager.getProducts();
    io.emit('products', productosActualizados);
    res.send("Producto eliminado exitosamente");
  } catch (error) {
    res.status(500).send("Error del servidor");
  }
});

module.exports = router;
