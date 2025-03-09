import { PrismaClient } from '@prisma/client';
import { Candidate } from '../../domain/models/Candidate';
import { Education } from '../../domain/models/Education';
import { Resume } from '../../domain/models/Resume';
import { WorkExperience } from '../../domain/models/WorkExperience';
import { validateCandidateData } from '../validator';

const prisma = new PrismaClient();

export const addCandidate = async (candidateData: any) => {
  try {
    validateCandidateData(candidateData); // Validar los datos del candidato
  } catch (error: any) {
    throw new Error(error);
  }

  const candidate = new Candidate(candidateData); // Crear una instancia del modelo Candidate
  try {
    const savedCandidate = await candidate.save(); // Guardar el candidato en la base de datos
    const candidateId = savedCandidate.id; // Obtener el ID del candidato guardado

    // Guardar la educación del candidato
    if (candidateData.educations) {
      for (const education of candidateData.educations) {
        const educationModel = new Education(education);
        educationModel.candidateId = candidateId;
        await educationModel.save();
        candidate.education.push(educationModel);
      }
    }

    // Guardar la experiencia laboral del candidato
    if (candidateData.workExperiences) {
      for (const experience of candidateData.workExperiences) {
        const experienceModel = new WorkExperience(experience);
        experienceModel.candidateId = candidateId;
        await experienceModel.save();
        candidate.workExperience.push(experienceModel);
      }
    }

    // Guardar los archivos de CV
    if (candidateData.cv && Object.keys(candidateData.cv).length > 0) {
      const resumeModel = new Resume(candidateData.cv);
      resumeModel.candidateId = candidateId;
      await resumeModel.save();
      candidate.resumes.push(resumeModel);
    }
    return savedCandidate;
  } catch (error: any) {
    if (error.code === 'P2002') {
      // Unique constraint failed on the fields: (`email`)
      throw new Error('The email already exists in the database');
    } else {
      throw error;
    }
  }
};

export const findCandidateById = async (
  id: number,
): Promise<Candidate | null> => {
  try {
    const candidate = await Candidate.findOne(id); // Cambio aquí: pasar directamente el id
    return candidate;
  } catch (error) {
    console.error('Error al buscar el candidato:', error);
    throw new Error('Error al recuperar el candidato');
  }
};

export const updateCandidateStage = async (
  candidateId: number,
  stageId: number,
) => {
  try {
    // Verificar que el candidato existe
    const candidate = await Candidate.findOne(candidateId);
    if (!candidate) {
      throw new Error('Candidato no encontrado');
    }

    // Verificar que la etapa existe
    const interviewStep = await prisma.interviewStep.findUnique({
      where: { id: stageId },
    });
    if (!interviewStep) {
      throw new Error('Etapa de entrevista no encontrada');
    }

    // Buscar aplicaciones activas para este candidato
    const applications = await prisma.application.findMany({
      where: { candidateId: candidateId },
    });

    if (applications.length === 0) {
      throw new Error('El candidato no tiene aplicaciones activas');
    }

    // Actualizar la etapa actual en todas las aplicaciones del candidato
    // Nota: En un caso real, probablemente quieras actualizar solo una aplicación específica
    await Promise.all(
      applications.map((app) =>
        prisma.application.update({
          where: { id: app.id },
          data: { currentInterviewStep: stageId },
        }),
      ),
    );

    return { message: 'Etapa del candidato actualizada correctamente' };
  } catch (error) {
    console.error('Error al actualizar la etapa del candidato:', error);
    throw error;
  }
};
