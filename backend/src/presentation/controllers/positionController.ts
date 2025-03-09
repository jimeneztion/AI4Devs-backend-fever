import { Request, Response } from 'express';
import {
  findPositionById,
  getPositionCandidates,
} from '../../application/services/positionService';

/**
 * Obtiene una posición por su ID
 */
export const getPositionById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Formato de ID inválido' });
    }
    const position = await findPositionById(id);
    if (!position) {
      return res.status(404).json({ error: 'Posición no encontrada' });
    }
    res.json(position);
  } catch (error) {
    console.error('Error en getPositionById:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * Obtiene todos los candidatos para una posición específica
 */
export const getPositionCandidatesController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Formato de ID inválido' });
    }

    const candidates = await getPositionCandidates(id);
    res.json(candidates);
  } catch (error: any) {
    console.error('Error en getPositionCandidatesController:', error);
    if (error.message === 'Posición no encontrada') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
};
