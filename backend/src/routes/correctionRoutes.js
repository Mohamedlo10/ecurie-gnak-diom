import { Router } from 'express';
import multer from 'multer';
import * as correctionController from '../controllers/correctionController.js';


// Configuration de Multer (stockage en mémoire)
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = Router();

router.post('/generate/:idSujet', correctionController.generateCorrection);
router.get('/sujet/:idSujet', correctionController.getCorrectionByIdSujet);
router.get('/:idCorrection', correctionController.getCorrectionById);
router.put('/:idCorrection', upload.single('file'), correctionController.modifierCorrection);
router.delete('/:idCorrection', correctionController.supprimerCorrection);

export default router;
