import express from 'express';
import { deleteProduct, getAllProducts, getProduct, insertProduct, updateProduct } from '../controllers/product.js';
export const productRouter = express.Router();


productRouter.get("/", getAllProducts);

//Obtener Productos
productRouter.get("/:id", getProduct);

// Eliminar Producto
productRouter.delete('/:id', deleteProduct);

// Insertar un nuevo Producto
productRouter.post('/', insertProduct);

// Actualizar Producto 
productRouter.put('/:id', updateProduct);