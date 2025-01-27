import express from "express"
import { AdminLogin } from '../controllers/adminController.js'
import cartRouter from "./cartRoute.js";

const adminRouter = express.Router();

adminRouter.post('/login',AdminLogin);

export default adminRouter;