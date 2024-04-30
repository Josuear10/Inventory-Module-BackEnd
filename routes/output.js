import express from 'express';
import { deleteOutputs, getAllOutputs, getOutputs, insertOutputs, updateOutputs } from '../controllers/output.js';
export const outputRouter = express.Router();

outputRouter.get("/", getAllOutputs);

//Obtener Salida
outputRouter.get("/:id", getOutputs);

// Eliminar Salida
outputRouter.delete('/:id', deleteOutputs);

// Insertar nueva Salida
outputRouter.post('/', insertOutputs);

// Actualizar Salida
outputRouter.put('/:id', updateOutputs);