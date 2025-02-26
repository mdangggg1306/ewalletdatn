import express from "express";
import {
  getAllservices,
  updateServices,
  addNewServices,
  deleteServices,
} from "../controllers/services.js";

const router = express.Router();

//CREATE
router.post("/create", addNewServices);
//READ
router.get("/", getAllservices);
//UPDATE
router.put("/update/:id", updateServices);
//DETELE
router.delete("/delete/:id", deleteServices);

export default router;
