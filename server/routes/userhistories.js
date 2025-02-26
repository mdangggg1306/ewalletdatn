import express from 'express';
import { getAllHistory, getHistory } from '../controllers/userhistories.js';

const router = express.Router();


//READ
router.get('/', getAllHistory);
router.get('/:id', getHistory);

export default router;
    