import express from 'express';
import { registerUtilisateur, loginUtilisateur,getAllUtilisateurs, updateUtilisateur, getUtilisateurById, deleteUtilisateur } from '../controllers/utilisateurController.js';

const router = express.Router();

// Route d'inscription
router.post('/register', registerUtilisateur);
router.put('/update', updateUtilisateur);
router.post('/login', loginUtilisateur);
router.get('/', getAllUtilisateurs);
router.get('/user/:id', getUtilisateurById);
router.delete('/:id', deleteUtilisateur);

export default router;
