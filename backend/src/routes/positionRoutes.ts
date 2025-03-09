import { Router } from 'express';
import {
  getPositionById,
  getPositionCandidatesController,
} from '../presentation/controllers/positionController';

const router = Router();

// Obtener una posición por su ID
router.get('/:id', getPositionById);

// Obtener candidatos para una posición específica
router.get('/:id/candidates', getPositionCandidatesController);

export default router;
