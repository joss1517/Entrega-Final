const Product = require('../models/product.model');

class ProductManager {
  async addProduct({ title, description, size, price, img, code, stock }) {
    // Validación de campos
    if (!title || !description || !size || !price || !img || !code || !stock) {
      console.log("Todos los campos son obligatorios");
      return;
    }

    
    const existingProduct = await Product.findOne({ code });
    if (existingProduct) {
      console.log("El código debe ser único");
      return;
    }

    // Crear nuevo producto
    const nuevoProducto = new Product({ title, description, size, price, img, code, stock });
    try {
      await nuevoProducto.save();
      console.log("Producto agregado exitosamente");
    } catch (error) {
      console.log("Error al agregar producto:", error);
    }
  }

  // Obtener todos los productos
  async getProducts() {
    try {
      return await Product.find(); 
    } catch (error) {
      console.log("Error al obtener productos:", error);
    }
  }

  async getProductById(id) {
    try {
      const producto = await Product.findById(id);
      if (!producto) {
        console.log("Producto no encontrado");
        return null;
      }
      console.log("Producto encontrado");
      return producto;
    } catch (error) {
      console.log("Error al buscar por id:", error);
    }
  }

  async updateProduct(id, updatedData) {
    try {
      const productoActualizado = await Product.findByIdAndUpdate(id, updatedData, { new: true });
      if (!productoActualizado) {
        console.log("No se encuentra el producto");
        return;
      }
      console.log("Producto actualizado");
    } catch (error) {
      console.log("Error al actualizar producto:", error);
    }
  }

  async deleteProduct(id) {
    try {
      const resultado = await Product.findByIdAndDelete(id);
      if (!resultado) {
        console.log("No se encuentra el producto");
        return;
      }
      console.log("Producto eliminado");
    } catch (error) {
      console.log("Error al eliminar producto:", error);
    }
  }
}

module.exports = ProductManager;
