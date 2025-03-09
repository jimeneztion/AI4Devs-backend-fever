import { PrismaClient } from '@prisma/client';
import { Position } from '../../domain/models/Position';

const prisma = new PrismaClient();

/**
 * Obtiene todos los candidatos para una posición específica, incluyendo la información
 * sobre la etapa actual y la puntuación media de las entrevistas.
 */
export const getPositionCandidates = async (positionId: number) => {
  try {
    // Verificar que la posición existe
    const position = await Position.findOne(positionId);
    if (!position) {
      throw new Error('Posición no encontrada');
    }

    // Obtener todas las aplicaciones para esta posición con sus candidatos y entrevistas
    const applications = await prisma.application.findMany({
      where: { positionId: positionId },
      include: {
        candidate: true,
        interviewStep: true,
        interviews: true,
      },
    });

    // Transformar los datos para el formato de respuesta
    const candidatesInfo = await Promise.all(
      applications.map(async (app) => {
        // Calcular el score promedio de todas las entrevistas del candidato
        const averageScore =
          app.interviews.length > 0
            ? app.interviews.reduce(
                (acc, interview) => acc + (interview.score || 0),
                0,
              ) / app.interviews.length
            : null;

        // Obtener el nombre de la etapa actual
        const currentStep = app.interviewStep;

        return {
          candidateId: app.candidateId,
          fullName: `${app.candidate.firstName} ${app.candidate.lastName}`,
          current_interview_step: currentStep.name,
          averageScore:
            averageScore !== null ? parseFloat(averageScore.toFixed(2)) : null,
        };
      }),
    );

    return candidatesInfo;
  } catch (error) {
    console.error('Error al obtener candidatos para la posición:', error);
    throw error;
  }
};

export const findPositionById = async (
  id: number,
): Promise<Position | null> => {
  try {
    const position = await Position.findOne(id);
    return position;
  } catch (error) {
    console.error('Error al buscar la posición:', error);
    throw new Error('Error al recuperar la posición');
  }
};
