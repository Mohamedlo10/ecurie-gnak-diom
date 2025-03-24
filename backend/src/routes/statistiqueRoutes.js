import express from 'express';
import { afficherStatistiquesProfesseur } from '../controllers/statistiqueController.js';

const router = express.Router();


router.get('/professeur/:idutilisateur', afficherStatistiquesProfesseur);

export default router;
