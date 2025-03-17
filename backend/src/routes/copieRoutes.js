import { Router } from 'express';
import multer from 'multer';
import * as copieController from '../controllers/copieController.js';

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = Router();

router.post('/', upload.single('file'), copieController.addCopie);
router.get('/sujet/:idsujet', copieController.getAllCopieByIdSujet);
router.get('/:idsujet/:idutilisateur', copieController.getCopieByIdSujetAndUser);
router.put('/:idcopie', upload.single('file'), copieController.updateCopie);
router.delete('/:idcopie', copieController.deleteCopie);

export default router;


