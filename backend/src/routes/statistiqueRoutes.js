import express from "express";
import {
  afficherStatistiquesEtudiant,
  afficherStatistiquesProfesseur,
} from "../controllers/statistiqueController.js";

const router = express.Router();

router.get("/professeur/:idutilisateur", afficherStatistiquesProfesseur);
router.get("/etudiant/:idutilisateur", afficherStatistiquesEtudiant);

export default router;
