import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { registerSchema, loginSchema } from '../schemas/auth';
import { RegisterInput, LoginInput } from '../types';
import { AppError } from '../utils/AppError';
import { logInfo } from '../utils/logger';
import {
  generateTokens,
  saveRefreshToken,
  verifyRefreshToken,
  updateLastLogin,
} from '../services/authService';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tenantName, email, password }: RegisterInput = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new AppError('Email address is already registered', 400);
    }

    const tenant = await prisma.tenant.create({
      data: { name: tenantName },
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        tenantId: tenant.id,
      },
    });

    const { accessToken, refreshToken } = generateTokens(user.id, tenant.id);
    await saveRefreshToken(user.id, refreshToken);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = user;

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      accessToken,
      user: userWithoutPassword,
    });

    logInfo('New user registered', { userId: user.id, tenantId: tenant.id });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password }: LoginInput = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email },
      include: { tenant: true },
    });

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new AppError('Invalid email or password', 401);
    }

    const { accessToken, refreshToken } = generateTokens(user.id, user.tenantId);
    await saveRefreshToken(user.id, refreshToken);
    await updateLastLogin(user.id);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = user;

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      accessToken,
      user: userWithoutPassword,
    });

    logInfo('User logged in', { userId: user.id });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw new AppError('Refresh token is required', 401);
    }

    const decoded = await verifyRefreshToken(refreshToken);
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      decoded.userId,
      decoded.tenantId
    );

    await saveRefreshToken(decoded.userId, newRefreshToken);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ accessToken });
  } catch (error) {
    next(error);
  }
}; 