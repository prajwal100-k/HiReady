import { Request, Response } from 'express';
import prisma from '../../config/db';

// Create new resume record
export async function createResume(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const {
      fileName,
      fileUrl,
      fileSize,
      atsScore,
      strengths,
      improvements,
      keywords,
    } = req.body;

    const resume = await prisma.resume.create({
      data: {
        userId,
        fileName,
        fileUrl,
        fileSize,
        atsScore,
        strengths: strengths ? JSON.stringify(strengths) : null,
        improvements: improvements ? JSON.stringify(improvements) : null,
        keywords: keywords ? JSON.stringify(keywords) : null,
        analyzedAt: atsScore ? new Date() : null,
      },
    });

    res.json(resume);
  } catch (error) {
    console.error('Create resume error:', error);
    res.status(500).json({ error: 'Failed to create resume' });
  }
}

// Get all resumes for current user
export async function getResumes(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const resumes = await prisma.resume.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    // Parse JSON fields
    const parsed = resumes.map((r) => ({
      ...r,
      strengths: r.strengths ? JSON.parse(r.strengths) : [],
      improvements: r.improvements ? JSON.parse(r.improvements) : [],
      keywords: r.keywords ? JSON.parse(r.keywords) : [],
    }));

    res.json(parsed);
  } catch (error) {
    console.error('Get resumes error:', error);
    res.status(500).json({ error: 'Failed to fetch resumes' });
  }
}

// Get single resume by ID
export async function getResumeById(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const resume = await prisma.resume.findFirst({
      where: { id, userId },
    });

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    // Parse JSON fields
    const parsed = {
      ...resume,
      strengths: resume.strengths ? JSON.parse(resume.strengths) : [],
      improvements: resume.improvements ? JSON.parse(resume.improvements) : [],
      keywords: resume.keywords ? JSON.parse(resume.keywords) : [],
    };

    res.json(parsed);
  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({ error: 'Failed to fetch resume' });
  }
}

// Update resume (typically for adding analysis results)
export async function updateResume(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const {
      atsScore,
      strengths,
      improvements,
      keywords,
    } = req.body;

    // Verify ownership
    const existing = await prisma.resume.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    const resume = await prisma.resume.update({
      where: { id },
      data: {
        atsScore,
        strengths: strengths ? JSON.stringify(strengths) : undefined,
        improvements: improvements ? JSON.stringify(improvements) : undefined,
        keywords: keywords ? JSON.stringify(keywords) : undefined,
        analyzedAt: atsScore ? new Date() : undefined,
      },
    });

    res.json(resume);
  } catch (error) {
    console.error('Update resume error:', error);
    res.status(500).json({ error: 'Failed to update resume' });
  }
}

// Delete resume
export async function deleteResume(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify ownership
    const existing = await prisma.resume.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    await prisma.resume.delete({
      where: { id },
    });

    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({ error: 'Failed to delete resume' });
  }
}
