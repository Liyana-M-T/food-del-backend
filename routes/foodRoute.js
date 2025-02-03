import express from 'express'
import { addFood, listFood, removeFood, updateFood } from '../controllers/foodController.js'
import upload from '../config/multer.js';

const foodRouter = express.Router();

foodRouter.post("/add",upload.single("image"),addFood)
foodRouter.get('/list',listFood)
foodRouter.put('/update',upload.single("image"),updateFood)
foodRouter.post('/remove',removeFood)

export default foodRouter;