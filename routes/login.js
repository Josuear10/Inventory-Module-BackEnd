//Carpeta Routes login.js
import express from "express";
import {
  postLogin
} from "../controllers/login.js";

export const loginRouter = express.Router();

//loginRouter.get("/", getLogin);

loginRouter.post("/", postLogin);
