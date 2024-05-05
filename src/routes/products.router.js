const ProductManager = require("../controllers/productManager");// aca estoy "importando"  productManager.js
const express = require("express");
const router = express.Router();


const products = new ProductManager();

//muestro todos los productos->
router.get("/", async (req, res) => {
    try {
        const limit = parseInt (req.query.limit);
        const prodList = await products.getProducts();
        console.log(prodList);
        if (limit>0) {
            res.json(prodList.slice(0, limit));
        } else{
            res.json(prodList);
        }
    }
    catch (error) {
        console.error("error del servidor", error);
        res.status(500).send("Error del servidor");
    }
});

//muestro producto por id->
router.get("/:id", async (req, res) => {// los ":" antes del id indican que es dinamico. se recibe en los params del req que hace el cliente"
    let id = req.params.id;
    try {
        const product = await products.getProductById(id);
        if (!product){
            return res.json({
                Error: `No existe el producto con el id ${id}`
            })
        }
        res.json(product);
    }
    catch (error) {
        console.error("error del servidor", error);
        res.status(404).json("Error interno del servidor");
    }
});

//agrego un producto->
router.post("/", async (req, res) => {
    let productToAdd = req.body;
    try { 
        await products.addProduct(productToAdd);
        res.status(201).send("Producto agregado correctamente");
    }
    catch(error) { 
        console.error("Error al agregar el producto:", error); 
        res.status(500).send("Error interno del servidor");
    }
});


//actualizo un producto->
router.put("/:id", async (req, res) => {
    const id = req.params.id;
    const updatedProduct = req.body;
    console.log(`Este producto es el actualizado: ${updatedProduct}`)
    try { 
        await products.updateProduct(id, updatedProduct)
        res.json({
            message: "Producto actualizado con éxito"
        });
    }
    catch(error) { 
        console.error("Error al actualizar el producto:", error); 
        res.status(500).send("Error del servidor - el producto no fue actualizado");
    }
});


//borro un producto->
router.delete("/:pid", async (req, res) => {
    try {
        const productId = req.params.pid; // Obtener el ID del producto de los parámetros
        await products.deleteProduct(productId); // Llamar a la función deleteProduct con el ID del producto
        res.json({
            message: "El producto fue eliminado correctamente"
        });
    } catch (error) {
        console.error(`No fue posible eliminar el producto`, error);
        res.status(500).send("Error del servidor - el producto no fue eliminado");
    }
});




module.exports = router;