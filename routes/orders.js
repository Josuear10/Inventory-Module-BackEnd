import express from 'express';
import { deleteOrders, getAllOrders, getOrders, insertOrders, updateOrders } from '../controllers/orders.js';
export const ordersRouter = express.Router();

ordersRouter.get("/", getAllOrders);

//Obtener Orden
ordersRouter.get("/:id", getOrders);

// Eliminar Orden
ordersRouter.delete('/:id', deleteOrders);

// Insertar nueva Orden
ordersRouter.post('/', insertOrders);

// Actualizar Orden 
ordersRouter.put('/:id', updateOrders);