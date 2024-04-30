import express from 'express';
import { deleteEntry, getAllEntrys, getEntry, insertEntry, updateEntry } from '../controllers/entrada.js';
export const entryRouter = express.Router();

entryRouter.get("/", getAllEntrys);

//Obtener Entrada
entryRouter.get("/:id", getEntry);

// Eliminar Entrada
entryRouter.delete('/:id', deleteEntry);

// Insertar nueva Entrada
entryRouter.post('/', insertEntry);

// Actualizar Entrada
entryRouter.put('/:id', updateEntry);