import express from 'express';
import { deleteProductDetails, getAllProductDetails, getProductDetails, insertProductDetails, updateProductDetails } from '../controllers/productdetail.js';
export const productDetailRouter = express.Router();


productDetailRouter.get("/", getAllProductDetails);

//Obtener Detalle Producto
productDetailRouter.get("/:id", getProductDetails);

// Eliminar Detalle Producto
productDetailRouter.delete('/:id', deleteProductDetails);

// Insertar Detalle Producto
productDetailRouter.post('/', insertProductDetails);

// Actualizar Detalle Producto 
productDetailRouter.put('/:id', updateProductDetails);
