const fs = require("fs").promises;
const path = require("path"); // Asegúrate de incluir esta línea

class CartManager {
  constructor() {
    this.carritos = [];
    this.path = path.resolve(__dirname, "../data/carts.json");
    this.cargarCarritos();
  }

  async cargarCarritos() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      this.carritos = JSON.parse(data);
    } catch (error) {
      console.log("Error al cargar los carritos, inicializando array vacío");
      this.carritos = [];
    }
  }

  async guardarCarritos() {
    try {
      await fs.writeFile(this.path, JSON.stringify(this.carritos, null, 2));
    } catch (error) {
      console.error("Error al guardar los carritos", error);
    }
  }

  async crearCarrito() {
    const nuevoCarrito = { _id: this.carritos.length + 1, products: [] };
    this.carritos.push(nuevoCarrito);
    await this.guardarCarritos();
    return nuevoCarrito;
  }

  async getCarritoById(id) {
    const carrito = this.carritos.find(c => c._id === id);
    if (!carrito) throw new Error('Carrito no encontrado');
    return carrito;
  }

  async getAllCarritos() {
    return this.carritos; // Método para obtener todos los carritos
  }

  async agregarProductoAlCarrito(carritoId, productoId, quantity = 1) {
    const carrito = await this.getCarritoById(carritoId);
    const productoExistente = carrito.products.find(p => p.product === productoId);

    if (productoExistente) {
      productoExistente.quantity += quantity;
    } else {
      carrito.products.push({ product: productoId, quantity });
    }

    await this.guardarCarritos();
    return carrito;
  }

  async eliminarProductoDelCarrito(carritoId, productId) {
    const carrito = await this.getCarritoById(carritoId);
    const index = carrito.products.findIndex(p => p.product === productId);

    if (index !== -1) {
      carrito.products.splice(index, 1);
    }

    await this.guardarCarritos();
    return carrito;
  }

  async actualizarCarrito(carritoId, productos) {
    const carrito = await this.getCarritoById(carritoId);
    carrito.products = [];

    await this.guardarCarritos();
    return carrito;
  }

  async actualizarCantidadProducto(carritoId, productId, quantity) {
    const carrito = await this.getCarritoById(carritoId);
    const producto = carrito.products.find(prod => prod.product === productId);

    if (producto) {
      producto.quantity = quantity;
    }

    await this.guardarCarritos();
    return carrito;
  }

  async eliminarTodoDelCarrito(carritoId) {
    const carrito = await this.getCarritoById(carritoId);
    carrito.products = [];

    await this.guardarCarritos();
    return carrito;
  }
}

module.exports = CartManager;
