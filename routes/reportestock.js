import express from 'express';
import { getProductStock } from '../controllers/reportestock.js';
export const ProductStockRouter = express.Router();

ProductStockRouter.get("/", getProductStock);

