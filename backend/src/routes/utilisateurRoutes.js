import express from 'express';
import {
    createUtilisateur,
    deleteUtilisateur,
    // getAllEtudiants,
    // getAllProfesseurs,
    getAllUtilisateurs,
    getUtilisateurById,
    loginUtilisateur,
    updateUtilisateur
} from '../controllers/utilisateurController.js';

const router = express.Router();

// Routes CRUD pour les utilisateurs
router.get('/', getAllUtilisateurs);
// router.get('/etudiants', getAllEtudiants);
// router.get('/professeurs', getAllProfesseurs);
router.get('/:id', getUtilisateurById);
router.post('/', createUtilisateur);
router.put('/:id', updateUtilisateur);
router.delete('/:id', deleteUtilisateur);
router.post('/login', loginUtilisateur);

export default router;