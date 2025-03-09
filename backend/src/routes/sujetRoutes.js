import {  getOneSujetByClasse,  getAllSujetsByClasse,createSujetForClasse, deleteSujetsByClasse } from "../controllers/sujetController.js";
import express from 'express';

const router = express.Router();

// router.get("/", getAllSujets);
// router.get("/:id", getSujetById);
// router.post("/", createSujet);
// router.put("/:id", updateSujet);
// router.delete("/:id", deleteSujet);
router.get("/classe/:idclasse", getAllSujetsByClasse);
router.get("/classe/:idclasse/one/:id", getOneSujetByClasse);
router.post("/classe/:idclasse", createSujetForClasse);

router.delete("/classe/:idclasse", deleteSujetsByClasse);

export default router;

