import express from 'express';
import {afficherStatistiquesProfesseur} from '../controllers/statistiqueController.js';

const router = express.Router();


router.get('/professeur', afficherStatistiquesProfesseur);

export default router;
