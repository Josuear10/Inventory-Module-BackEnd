import express from 'express';
import { getTopProducts } from '../controllers/reportetopproductos.js';
export const TopProductsRouter = express.Router();

TopProductsRouter.get("/", getTopProducts);

