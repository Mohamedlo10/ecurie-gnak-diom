import express from "express";
import { createSuivre, getAllSuivres, getSuivreById, deleteSuivre } from "../controllers/suivreController.js";

const router = express.Router();

router.post("/", createSuivre);
router.get("/", getAllSuivres);
router.get("/:id", getSuivreById);
router.delete("/:id", deleteSuivre);

export default router;
