import express from 'express';
import {
    deleteCopie,
    evaluateCopie,
    getAllCopies,
    getCopieById,
    submitCopie,
    updateCopie,
} from '../controllers/copieController.js';

const router = express.Router();

router.get('/', getAllCopies); 
router.get('/:id', getCopieById); 
router.post('/', submitCopie);
router.post('/evaluate', evaluateCopie); 
router.put('/:id', updateCopie); 
router.delete('/:id', deleteCopie); 

export default router;