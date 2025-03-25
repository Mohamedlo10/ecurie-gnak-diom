import express from "express";
import { createPlagiat, getAllPlagiats, getPlagiatById, updatePlagiat, deletePlagiat } from "../controllers/plagiatController.js";

const router = express.Router();

router.post("/", createPlagiat);
router.get("/", getAllPlagiats);
router.get("/:id", getPlagiatById);
router.put("/:id", updatePlagiat);
router.delete("/:id", deletePlagiat);

export default router;
