import express from 'express';
import { registerUtilisateur, loginUtilisateur } from '../controllers/utilisateurController.js';

const router = express.Router();

// Route d'inscription
router.post('/register', registerUtilisateur);

// Route de connexion
router.post('/login', loginUtilisateur);

export default router;
