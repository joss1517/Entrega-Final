const fs = require("fs").promises;
const path = require("path"); 

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

  async todosLosCarritos() {
    return this.carritos;
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
    return await Cart.findByIdAndUpdate(
      carritoId,
      { $pull: { products: { product: productId } } },
      { new: true }
    ).populate("products.product"); 
  }

  async actualizarCarrito(carritoId, productos) {
    return await Cart.findByIdAndUpdate(
      carritoId,
      { products: productos },
      { new: true }
    ).populate("products.product");
  }

  async actualizarCantidadProducto(carritoId, productId, quantity) {
    return await Cart.findOneAndUpdate(
      { _id: carritoId, "products.product": productId },
      { $set: { "products.$.quantity": quantity } },
      { new: true }
    ).populate("products.product");
  }

  async eliminarTodoDelCarrito(carritoId) {
    const carrito = await this.getCarritoById(carritoId);
    carrito.products = [];

    await this.guardarCarritos();
    return carrito;
  }

  async eliminarTodoDelCarrito(carritoId) {
    return await Cart.findByIdAndUpdate(
      carritoId,
      { products: [] },
      { new: true }
    ).populate("products.product");
  }


}

module.exports = CartManager;
