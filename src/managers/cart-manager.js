const fs = require("fs").promises;
const path = require("path");

class CartManager {
  constructor() {
    this.carritos = [];
    this.path = path.resolve(__dirname, "../data/carts.json"); // Asegúrate de que esta ruta sea correcta
    this.cargarCarritos();
  }

  async cargarCarritos() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      this.carritos = JSON.parse(data);
    } catch (error) {
      console.log("Error al cargar los carritos, inicializando array vacío");
      this.carritos = []; // Inicializar con un array vacío si hay un error
    }
  }

  async guardarCarritos() {
    try {
      await fs.writeFile(this.path, JSON.stringify(this.carritos, null, 2));
    } catch (error) {
      console.error("Error al guardar los carritos", error);
    }
  }

  // Método para crear un carrito
  async crearCarrito() {
    const nuevoCarrito = { id: this.carritos.length + 1, products: [] };
    this.carritos.push(nuevoCarrito);
    await this.guardarCarritos();
    return nuevoCarrito;
  }

  async getCarritoById(id) {
    const carrito = this.carritos.find(c => c.id === id);
    if (!carrito) throw new Error('Carrito no encontrado');
    return carrito;
  }

  async agregarProductoAlCarrito(carritoId, productoId, quantity = 1) {
    const carrito = await this.getCarritoById(carritoId);
    const productoExistente = carrito.products.find(p => p.product === productoId);

    if (productoExistente) {
      productoExistente.quantity += quantity; // Aumentar cantidad si ya existe
    } else {
      carrito.products.push({ product: productoId, quantity }); // Agregar nuevo producto
    }

    await this.guardarCarritos();
    return carrito;
  }

  async eliminarProductoDelCarrito(carritoId, productId) {
    const carrito = await this.getCarritoById(carritoId);
    const index = carrito.products.findIndex(p => p.product === productId);

    if (index !== -1) {
      carrito.products.splice(index, 1); // Eliminar producto
    }

    await this.guardarCarritos();
    return carrito;
  }

  async actualizarCarrito(carritoId, productos) {
    const carrito = await this.getCarritoById(carritoId);
    carrito.products = productos; // Asigna el nuevo arreglo de productos

    await this.guardarCarritos();
    return carrito;
  }

  async actualizarCantidadProducto(carritoId, productId, quantity) {
    const carrito = await this.getCarritoById(carritoId);
    const producto = carrito.products.find(prod => prod.product === productId);

    if (producto) {
      producto.quantity = quantity; // Actualiza la cantidad
    }

    await this.guardarCarritos();
    return carrito;
  }

  async eliminarTodoDelCarrito(carritoId) {
    const carrito = await this.getCarritoById(carritoId);
    carrito.products = []; // Limpia los productos del carrito

    await this.guardarCarritos();
    return carrito;
  }
}

module.exports = CartManager;
