import express from "express";
import { createPlagiatCopie, getAllPlagiatCopies, getPlagiatCopieById, deletePlagiatCopie } from "../controllers/plagiatCopieController.js";

const router = express.Router();

router.post("/", createPlagiatCopie);
router.get("/", getAllPlagiatCopies);
router.get("/:id", getPlagiatCopieById);
router.delete("/:id", deletePlagiatCopie);

export default router;
