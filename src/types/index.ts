import { Request } from 'express';

export interface User {
  id: string;
  email: string;
  password: string;
  tenantId: string;
  createdAt: Date;
}

export interface AuthenticatedRequest extends Request {
  context?: {
    userId: string;
    tenantId: string;
  };
}

export interface RegisterInput {
  tenantName: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: Omit<User, 'password'>;
} 