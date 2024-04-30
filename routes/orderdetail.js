import express from 'express';
import { deleteOrderDetail, getAllOrderDetail, getOrderDetail, insertOrderDetail, updateOrderDetail } from '../controllers/orderdetail.js';
export const orderDetailRouter = express.Router();

orderDetailRouter.get("/", getAllOrderDetail);

//Obtener DetalleOrden
orderDetailRouter.get("/:id", getOrderDetail);

// Eliminar DetalleOrden
orderDetailRouter.delete('/:id', deleteOrderDetail);

// Insertar un nuevo DetalleOrden
orderDetailRouter.post('/', insertOrderDetail);

// Actualizar DetalleOrden 
orderDetailRouter.put('/:id', updateOrderDetail);