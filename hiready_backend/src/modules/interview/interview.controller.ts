import { Request, Response } from 'express';
import prisma from '../../config/db';

// Create new interview record
export async function createInterview(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const {
      jobRole,
      experienceLevel,
      duration,
      transcript,
      overallScore,
      confidenceScore,
      contentScore,
      strengths,
      improvements,
      rejectionReasons,
      technicalSkills,
      communication,
      problemSolving,
      confidence,
      technical,
      leadership,
      adaptability,
      teamwork,
    } = req.body;

    const interview = await prisma.interview.create({
      data: {
        userId,
        jobRole,
        experienceLevel,
        duration,
        transcript: JSON.stringify(transcript),
        overallScore,
        confidenceScore,
        contentScore,
        strengths: strengths ? JSON.stringify(strengths) : null,
        improvements: improvements ? JSON.stringify(improvements) : null,
        rejectionReasons: rejectionReasons ? JSON.stringify(rejectionReasons) : null,
        technicalSkills,
        communication,
        problemSolving,
        confidence,
        technical,
        leadership,
        adaptability,
        teamwork,
        analyzedAt: overallScore ? new Date() : null,
      },
    });

    res.json(interview);
  } catch (error) {
    console.error('Create interview error:', error);
    res.status(500).json({ error: 'Failed to create interview' });
  }
}

// Get all interviews for current user
export async function getInterviews(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const interviews = await prisma.interview.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        jobRole: true,
        experienceLevel: true,
        duration: true,
        overallScore: true,
        confidenceScore: true,
        contentScore: true,
        analyzedAt: true,
        createdAt: true,
        updatedAt: true,
        // Exclude transcript for list view (can be large)
      },
    });

    res.json(interviews);
  } catch (error) {
    console.error('Get interviews error:', error);
    res.status(500).json({ error: 'Failed to fetch interviews' });
  }
}

// Get single interview by ID (with full transcript)
export async function getInterviewById(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const interview = await prisma.interview.findFirst({
      where: { id, userId },
    });

    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    // Parse JSON fields
    const parsed = {
      ...interview,
      transcript: JSON.parse(interview.transcript),
      strengths: interview.strengths ? JSON.parse(interview.strengths) : [],
      improvements: interview.improvements ? JSON.parse(interview.improvements) : [],
      rejectionReasons: interview.rejectionReasons ? JSON.parse(interview.rejectionReasons) : [],
    };

    res.json(parsed);
  } catch (error) {
    console.error('Get interview error:', error);
    res.status(500).json({ error: 'Failed to fetch interview' });
  }
}

// Update interview (typically for adding analysis results)
export async function updateInterview(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const {
      overallScore,
      confidenceScore,
      contentScore,
      strengths,
      improvements,
      rejectionReasons,
      technicalSkills,
      communication,
      problemSolving,
      confidence,
      technical,
      leadership,
      adaptability,
      teamwork,
    } = req.body;

    // Verify ownership
    const existing = await prisma.interview.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    const interview = await prisma.interview.update({
      where: { id },
      data: {
        overallScore,
        confidenceScore,
        contentScore,
        strengths: strengths ? JSON.stringify(strengths) : undefined,
        improvements: improvements ? JSON.stringify(improvements) : undefined,
        rejectionReasons: rejectionReasons ? JSON.stringify(rejectionReasons) : undefined,
        technicalSkills,
        communication,
        problemSolving,
        confidence,
        technical,
        leadership,
        adaptability,
        teamwork,
        analyzedAt: overallScore ? new Date() : undefined,
      },
    });

    res.json(interview);
  } catch (error) {
    console.error('Update interview error:', error);
    res.status(500).json({ error: 'Failed to update interview' });
  }
}

// Delete interview
export async function deleteInterview(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify ownership
    const existing = await prisma.interview.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    await prisma.interview.delete({
      where: { id },
    });

    res.json({ message: 'Interview deleted successfully' });
  } catch (error) {
    console.error('Delete interview error:', error);
    res.status(500).json({ error: 'Failed to delete interview' });
  }
}
