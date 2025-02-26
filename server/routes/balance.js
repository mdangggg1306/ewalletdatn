import express from 'express';
import { thanhtoan } from '../controllers/balance.js';

const router = express.Router();

//LOGIN
router.post('/deduct', thanhtoan);


export default router;