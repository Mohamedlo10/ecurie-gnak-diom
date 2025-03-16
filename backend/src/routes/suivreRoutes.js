import express from "express";
import { addEtudiant, exclureEtudiant, getCoursByIdEtudiant, getEtudiantByIdCours, getOne } from "../controllers/suivreController.js";

const router = express.Router();

router.post("/", addEtudiant);
router.get("/cours/:idutilisateur", getCoursByIdEtudiant);
router.get("/etudiant/:idcours", getEtudiantByIdCours);
router.get("/:idcours/:idutilisateur", getOne);
router.delete("/", exclureEtudiant);

export default router;
