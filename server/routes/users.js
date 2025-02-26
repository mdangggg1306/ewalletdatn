import express from 'express';
import { getAllUsers, getUsers, updateUser, deleteUser,addNewuser } from '../controllers/users.js';

const router = express.Router();

//CREATE
router.post('/create', addNewuser);
//READ
router.get('/', getAllUsers);
router.get('/:id', getUsers)
//UPDATE
router.put('/update/:id',updateUser);
//DETELE
router.delete('/delete/:id',deleteUser);


export default router;
    