const { trusted } = require("mongoose");
const CartModel = require("../models/cart.model.js");

class CartManager {

    // Crear un nuevo carrito
    async createNewCart() {
        try {
            const newCart = new CartModel({ products: [], quantity:0});
            await newCart.save();
            return newCart;
        } catch (error) {
            console.error("Error al crear el carrito:", error);
            throw error;
        }
    }

    // Agregar un producto al carrito
    async addProductToCart(cartId, product, quantity = 1) {
        try {
            const cart = await this.getCartById(cartId);
            const productId = product._id;
            const cartProduct = cart.products.find(p => p.product.toString() === productId);
    
            if (cartProduct) {
                cartProduct.quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }
    
            cart.markModified("products");
            await cart.save();
            return cart;
        } catch (error) {
            console.error("Error al agregar el producto", error);
            throw error;
        }
    }

    // Obtener todos los carritos
    async getCarts() {
        try {
            const carts = await CartModel.find();
            return carts
        } catch (error) {
            console.error("Error del servidor al obtener los carritos");
            throw error;
        }
    };

    // Obtener un carrito por su ID
    async getCartById(cartId) {
        try {
            const cart = await CartModel.findById(cartId).populate('products.product');
            console.log(`esto se imprime desde getCartById ${cart}`)
            if (!cart) {
                console.log(`No se encontró el carrito con id ${cartId}`);
                return null;
            }
            return cart;
        } catch (error) {
            console.error("Error del servidor - no se pudo obtener el carrito especificado");
            throw error;
        }
    }

    // Eliminar un producto del carrito por su ID
    async deleteProductById(cartId, productId) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                console.log(`Carrito ${cartId} inexistente. Verifique el ID`);
                return { success: false, message: `Carrito ${cartId} inexistente. Verifique el ID` };
            } else {
                const index = cart.products.findIndex(p => p.product.toString() === productId);
                if (index !== -1) {
                    cart.products.splice(index, 1);
                    await cart.save();
                    console.log(`Producto ${productId} eliminado del carrito ${cartId} con éxito`);
                    return { success: true, message: `Producto ${productId} eliminado del carrito ${cartId} con éxito` };
                } else {
                    console.log(`Producto ${productId} no encontrado en el carrito ${cartId}`);
                    return { success: false, message: `Producto ${productId} no encontrado en el carrito ${cartId}` };
                }
            }
        } catch (error) {
            console.error("Error del servidor", error);
            throw error;
        }
    }

    // Actualizar un carrito
    async updateCart(cartId, products) {
        try {
            const cart = await CartModel.findByIdAndUpdate(cartId, { products: products }, { new: true });
            if (!cart) {
                console.log(`No se encontró el carrito con ID ${cartId}`);
                return null;
            }
            console.log(`Carrito actualizado con éxito: ${cart}`);
            return cart;
        } catch (error) {
            console.error("Error al actualizar el carrito:", error);
            throw error;
        }
    }

    // Vaciar un carrito
    async clearCart(cartId){
        const products= [];
        try {
            const cart = await CartModel.findByIdAndUpdate(cartId,{ products: products },{new:true});
            if (!cart) {
                console.log(`No se encontró el carrito con ID ${cartId}`);
                return null;
            }
            console.log(`Carrito actualizado con éxito: ${cart}`);
            return cart;
        } catch (error) {
            console.error("Error al actualizar el carrito:", error);
            throw error;
        }
    }

}

module.exports = CartManager;
