import express from 'express';
import {
    createClasse,
    getAllClasses,
    getClasseById,
    updateClasse,
    deleteClasse,
    getClasseByIdProfesseur
} from '../controllers/classeController.js';

const router = express.Router();

router.post('/', createClasse);  
router.get('/', getAllClasses);  
router.get('/:id', getClasseById);  
router.put('/:id', updateClasse);  
router.delete('/:id', deleteClasse);  
router.get('/Utilisateur/:idUtilisateur', getClasseByIdProfesseur);  

export default router;