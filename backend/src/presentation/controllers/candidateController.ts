import { Request, Response } from 'express';
import {
  addCandidate,
  findCandidateById,
  updateCandidateStage,
} from '../../application/services/candidateService';

export const addCandidateController = async (req: Request, res: Response) => {
  try {
    const candidateData = req.body;
    const candidate = await addCandidate(candidateData);
    res
      .status(201)
      .json({ message: 'Candidate added successfully', data: candidate });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res
        .status(400)
        .json({ message: 'Error adding candidate', error: error.message });
    } else {
      res
        .status(400)
        .json({ message: 'Error adding candidate', error: 'Unknown error' });
    }
  }
};

export const getCandidateById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    const candidate = await findCandidateById(id);
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    res.json(candidate);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Actualiza la etapa actual del proceso de entrevista para un candidato
 */
export const updateCandidateStageController = async (
  req: Request,
  res: Response,
) => {
  try {
    const candidateId = parseInt(req.params.id);
    if (isNaN(candidateId)) {
      return res
        .status(400)
        .json({ error: 'Formato de ID de candidato inválido' });
    }

    // Validar que se proporciona el ID de la etapa
    const { stageId } = req.body;
    if (!stageId || isNaN(parseInt(stageId))) {
      return res
        .status(400)
        .json({ error: 'Se requiere un ID de etapa válido' });
    }

    const result = await updateCandidateStage(candidateId, parseInt(stageId));
    res.json(result);
  } catch (error: any) {
    console.error('Error en updateCandidateStageController:', error);
    if (
      error.message === 'Candidato no encontrado' ||
      error.message === 'Etapa de entrevista no encontrada' ||
      error.message === 'El candidato no tiene aplicaciones activas'
    ) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
};

export { addCandidate };
