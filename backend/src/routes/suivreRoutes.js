import express from "express";
import { addEtudiant, getCoursByIdEtudiant, getEtudiantByIdCours, getOne, exclureEtudiant } from "../controllers/suivreController.js";

const router = express.Router();

router.post("/", addEtudiant);
router.get("/cours/:idutilisateur", getCoursByIdEtudiant);
router.get("/etudiant/:idcours", getEtudiantByIdCours);
router.get("/:idcours/:idutilisateur", getOne);
router.delete("/:id", exclureEtudiant);

export default router;
