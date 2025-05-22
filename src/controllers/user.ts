import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/AppError';
import { logInfo } from '../utils/logger';
import { AuthenticatedRequest } from '../types';

const prisma = new PrismaClient();

export const getProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
      include: { tenant: true },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    res.json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    if (email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser && existingUser.id !== req.user?.id) {
        throw new AppError('Email address is already in use', 400);
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user?.id },
      data: { email },
      include: { tenant: true },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = updatedUser;

    res.json(userWithoutPassword);
    logInfo('User profile updated', { userId: req.user?.id });
  } catch (error) {
    next(error);
  }
}; 