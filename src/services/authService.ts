import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';
import { logInfo } from '../utils/logger';

const prisma = new PrismaClient();

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

export const generateTokens = (userId: string, tenantId: string) => {
  const accessToken = jwt.sign(
    { userId, tenantId },
    process.env.JWT_SECRET!,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );

  const refreshToken = jwt.sign(
    { userId, tenantId },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );

  return { accessToken, refreshToken };
};

export const saveRefreshToken = async (userId: string, token: string) => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

  await prisma.refreshToken.upsert({
    where: { userId },
    update: {
      token,
      expiresAt,
    },
    create: {
      userId,
      token,
      expiresAt,
    },
  });
};

export const verifyRefreshToken = async (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as {
      userId: string;
      tenantId: string;
    };

    const storedToken = await prisma.refreshToken.findUnique({
      where: { userId: decoded.userId },
    });

    if (!storedToken || storedToken.token !== token) {
      throw new AppError('Invalid refresh token', 401);
    }

    if (storedToken.expiresAt < new Date()) {
      throw new AppError('Refresh token expired', 401);
    }

    return decoded;
  } catch {
    throw new AppError('Invalid refresh token', 401);
  }
};

export const updateLastLogin = async (userId: string) => {
  await prisma.user.update({
    where: { id: userId },
    data: { lastLogin: new Date() },
  });
  logInfo('User login updated', { userId });
}; 