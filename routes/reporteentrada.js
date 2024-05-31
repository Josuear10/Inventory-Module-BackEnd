import express from 'express';
import { getRentrys } from '../controllers/reporteentrada.js';
export const rentryRouter = express.Router();

rentryRouter.get("/", getRentrys);

