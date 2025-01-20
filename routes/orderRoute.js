import express from 'express';
import { placeOrder,userOrders,verifyOrder,listOrders,updateStatus } from '../controllers/orderController.js';
import authMiddleware from '../middleware/auth.js';

const orderRouter = express.Router();

orderRouter.post('/placeOrder',authMiddleware, placeOrder); 
orderRouter.post('/verify',authMiddleware, verifyOrder);
orderRouter.post('/userOrders',authMiddleware,userOrders);
orderRouter.get('/list',listOrders)
orderRouter.post('/status',updateStatus)
export default orderRouter;
