import express from 'express';
import { registerUtilisateur, loginUtilisateur,getAllUtilisateurs } from '../controllers/utilisateurController.js';

const router = express.Router();

// Route d'inscription
router.post('/register', registerUtilisateur);

// Route de connexion
router.post('/login', loginUtilisateur);
router.get('/', getAllUtilisateurs);

export default router;
