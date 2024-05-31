import express from 'express';
import { getTopProveedores } from '../controllers/reportetopproveedores.js';
export const TopProveedoresRouter = express.Router();

TopProveedoresRouter.get("/", getTopProveedores);

