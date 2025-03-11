import express from 'express';
import {
    createSujet,
    // deleteSujet,
    getAllSujets,
    getSujetById,
} from '../controllers/sujetController.js';

const router = express.Router();

router.get('/', getAllSujets); 
router.get('/:id', getSujetById); 
router.post('/', createSujet);
// router.put('/:id', updateSujet); 
// router.delete('/:id', deleteSujet); 

export default router;