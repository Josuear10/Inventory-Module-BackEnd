import express from 'express';
import { deleteRequisition, getAllRequisition, getRequisition, insertRequisition, updateRequisition } from '../controllers/requisition.js';
export const requisitionRouter = express.Router();

requisitionRouter.get("/", getAllRequisition);

//Obtener Requisicion
requisitionRouter.get("/:id", getRequisition);

// Eliminar Requisicion
requisitionRouter.delete('/:id', deleteRequisition);

// Insertar nueva Requisicion
requisitionRouter.post('/', insertRequisition);

// Actualizar Requisicion
requisitionRouter.put('/:id', updateRequisition);