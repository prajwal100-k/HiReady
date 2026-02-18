import { Request, Response } from 'express';
import prisma from '../../config/db';

// Create new aptitude test record
export async function createAptitudeTest(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const {
      answers,
      score,
      totalQuestions = 10,
      timeSpent,
    } = req.body;

    const aptitudeTest = await prisma.aptitudeTest.create({
      data: {
        userId,
        answers: JSON.stringify(answers),
        score,
        totalQuestions,
        timeSpent,
      },
    });

    res.json(aptitudeTest);
  } catch (error) {
    console.error('Create aptitude test error:', error);
    res.status(500).json({ error: 'Failed to create aptitude test' });
  }
}

// Get all aptitude tests for current user
export async function getAptitudeTests(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const tests = await prisma.aptitudeTest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    // Parse JSON fields
    const parsed = tests.map((t) => ({
      ...t,
      answers: JSON.parse(t.answers),
    }));

    res.json(parsed);
  } catch (error) {
    console.error('Get aptitude tests error:', error);
    res.status(500).json({ error: 'Failed to fetch aptitude tests' });
  }
}

// Get single aptitude test by ID
export async function getAptitudeTestById(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const test = await prisma.aptitudeTest.findFirst({
      where: { id, userId },
    });

    if (!test) {
      return res.status(404).json({ error: 'Aptitude test not found' });
    }

    // Parse JSON fields
    const parsed = {
      ...test,
      answers: JSON.parse(test.answers),
    };

    res.json(parsed);
  } catch (error) {
    console.error('Get aptitude test error:', error);
    res.status(500).json({ error: 'Failed to fetch aptitude test' });
  }
}

// Get user's best score
export async function getBestScore(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const bestTest = await prisma.aptitudeTest.findFirst({
      where: { userId },
      orderBy: { score: 'desc' },
      take: 1,
    });

    if (!bestTest) {
      return res.json({ score: 0, totalQuestions: 10 });
    }

    res.json({
      score: bestTest.score,
      totalQuestions: bestTest.totalQuestions,
      createdAt: bestTest.createdAt,
    });
  } catch (error) {
    console.error('Get best score error:', error);
    res.status(500).json({ error: 'Failed to fetch best score' });
  }
}

// Delete aptitude test
export async function deleteAptitudeTest(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify ownership
    const existing = await prisma.aptitudeTest.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Aptitude test not found' });
    }

    await prisma.aptitudeTest.delete({
      where: { id },
    });

    res.json({ message: 'Aptitude test deleted successfully' });
  } catch (error) {
    console.error('Delete aptitude test error:', error);
    res.status(500).json({ error: 'Failed to delete aptitude test' });
  }
}
