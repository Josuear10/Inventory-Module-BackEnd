import express from 'express';
import { deleteProviders, getAllProviders, getProviders, insertProviders, updateProviders } from '../controllers/proveedor.js';
export const providerRouter = express.Router();

providerRouter.get("/", getAllProviders);

//Obtener Proveedor
providerRouter.get("/:id", getProviders);

// Eliminar Proveedor
providerRouter.delete('/:id', deleteProviders);

// Insertar un nuevo Proveedor
providerRouter.post('/', insertProviders);

// Actualizar Proveedor 
providerRouter.put('/:id', updateProviders);