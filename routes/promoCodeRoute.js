import express from 'express';
import {
  createPromoCode,
  validatePromoCode,
  deactivatePromoCode,
  fetchPromoCodes
} from '../controllers/promoCodeController.js';

const promocodeRouter = express.Router();

promocodeRouter.post('/create', createPromoCode);
promocodeRouter.delete('/deactivate', deactivatePromoCode);
promocodeRouter.get('/', fetchPromoCodes); 
promocodeRouter.post('/validate', validatePromoCode);

export default promocodeRouter;
