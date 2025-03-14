import express from "express";
import { createCours, getAllCours, getCoursById, getCoursByIdProfesseur, updateCours, deleteCours } from "../controllers/coursController.js";

const router = express.Router();

router.post("/", createCours);
router.get("/", getAllCours);
router.get("/:id", getCoursById);
router.get("/professeur/:id", getCoursByIdProfesseur);
router.put("/", updateCours);
router.delete("/:id", deleteCours);
// router.get("/etudiant/:id", getEtudiantByIdCours);

export default router;
