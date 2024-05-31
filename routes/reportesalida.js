import express from 'express';
import { getRoutputs } from '../controllers/reportesalida.js';
export const routputRouter = express.Router();

routputRouter.get("/", getRoutputs);

