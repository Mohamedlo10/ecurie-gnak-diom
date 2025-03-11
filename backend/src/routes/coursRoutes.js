import express from "express";
import { createCours, getAllCours, getCoursById, updateCours, deleteCours } from "../controllers/coursController.js";

const router = express.Router();

router.post("/", createCours);
router.get("/", getAllCours);
router.get("/:id", getCoursById);
router.put("/:id", updateCours);
router.delete("/:id", deleteCours);

export default router;
