import express from "express";
import { createEtudiant, getAllEtudiants, getEtudiantById, deleteEtudiant } from "../controllers/etudiantController.js";

const router = express.Router();

router.post("/", createEtudiant);
router.get("/", getAllEtudiants);
router.get("/:id", getEtudiantById);
router.delete("/:id", deleteEtudiant);

export default router;
