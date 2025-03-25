import express from "express";
import { createProfesseur, getAllProfesseurs, getProfesseurById, deleteProfesseur } from "../controllers/professeurController.js";

const router = express.Router();

router.post("/", createProfesseur);
router.get("/", getAllProfesseurs);
router.get("/:id", getProfesseurById);
router.delete("/:id", deleteProfesseur);

export default router;
