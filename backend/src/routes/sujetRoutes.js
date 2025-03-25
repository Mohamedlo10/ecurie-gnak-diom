import { Router } from 'express';
import multer from 'multer';
import * as sujetController from '../controllers/sujetController.js';

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = Router();

router.post('/', upload.single('file'), sujetController.createSujet);
router.get('/cours/:idCours', sujetController.getAllSujetByIdCours);
router.get('/professeur/:idutilisateur', sujetController.getAllSujetByIdProf);
router.get('/etudiant/:idutilisateur', sujetController.getAllSujetByIdEtudiant);
router.get('/:idSujet', sujetController.getSujetById);
router.put('/:idSujet', upload.single('file'), sujetController.updateSujet);
router.delete('/:idSujet', sujetController.deleteSujet);

export default router;
