import express from 'express';
import { deleteOffice, getAllOffice, getOffice, insertOffice, updateOffice } from '../controllers/office.js';
export const officeRouter = express.Router();

officeRouter.get("/", getAllOffice);

//Obtener Empleado
officeRouter.get("/:id", getOffice);

// Eliminar Empleado
officeRouter.delete('/:id', deleteOffice);

// Insertar un nuevo Empleado
officeRouter.post('/', insertOffice);

// Actualizar Empleado 
officeRouter.put('/:id', updateOffice);