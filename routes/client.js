import express from 'express';
import { deleteClients, getAllClients, getClients, insertClient, updateClient } from '../controllers/client.js';
export const clientRouter = express.Router();

clientRouter.get("/", getAllClients);

//Obtener Cliente
clientRouter.get("/:id", getClients);

// Eliminar Cliente
clientRouter.delete('/:id', deleteClients);

// Insertar un nuevo Cliente
clientRouter.post('/', insertClient);

// Actualizar Cliente 
clientRouter.put('/:id', updateClient);