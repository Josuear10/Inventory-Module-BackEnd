import express from 'express';
import { getKardex } from '../controllers/kardex.js';
export const kardexRouter = express.Router();

kardexRouter.get("/", getKardex);

