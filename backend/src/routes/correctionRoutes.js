import express from 'express';
import {
    // deleteCorrection,
    generateCorrection,
    // getAllCorrections,
    getCorrectionById,
} from '../controllers/correctionController.js';

const router = express.Router();

// router.get('/', getAllCorrections); 
router.get('/:id', getCorrectionById); 
router.post('/', generateCorrection); 
// router.put('/:id', updateCorrection); 
// router.delete('/:id', deleteCorrection); 

export default router;