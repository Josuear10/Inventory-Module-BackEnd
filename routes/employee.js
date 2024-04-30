import express from 'express';
import { deleteEmployees, getAllEmployees, getEmployees, insertEmployees, updateEmployees } from '../controllers/employee.js';
export const employeeRouter = express.Router();

employeeRouter.get("/", getAllEmployees);

//Obtener Empleado
employeeRouter.get("/:id", getEmployees);

// Eliminar Empleado
employeeRouter.delete('/:id', deleteEmployees);

// Insertar un nuevo Empleado
employeeRouter.post('/', insertEmployees);

// Actualizar Empleado 
employeeRouter.put('/:id', updateEmployees);