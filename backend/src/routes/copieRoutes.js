import express from 'express';
import {
    deleteCopie,
    evaluateCopie,
    getAllCopieByIdSujet,
    getCopieByEtudiantAndSujet,
    getCopieById,
    getAllCopiesByIdEtudiant,  
    submitCopie,
    updateCopie,
} from '../controllers/copieController.js';

const router = express.Router();

router.get('/sujet/:idsujet', getAllCopieByIdSujet); 
router.get('/etudiant/:idetudiant/sujet/:idsujet', getCopieByEtudiantAndSujet); 
router.get('/:id', getCopieById);
router.get('/etudiant/:idetudiant', getAllCopiesByIdEtudiant);  
router.post('/', submitCopie);
router.post('/evaluate', evaluateCopie); 
router.put('/:id', updateCopie); 
router.delete('/:id', deleteCopie);

export default router;
