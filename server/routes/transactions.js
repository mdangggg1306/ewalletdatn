import express from 'express';
import { getAllTransactions,getTransaction, addTran, transfer, depositadmin } from '../controllers/transactions.js';

const router = express.Router();


//READ
router.get('/', getAllTransactions);
router.get('/:id', getTransaction);
//add
router.post('/create', addTran);
//transfer
router.post('/transfer',transfer);
//deposit 
router.post('/depositadmin',depositadmin);
export default router;
    