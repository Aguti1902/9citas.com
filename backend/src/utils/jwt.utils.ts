import jwt, { SignOptions } from 'jsonwebtoken';

export const generateAccessToken = (userId: string): string => {
  const options: SignOptions = {
    expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m'
  };
  return jwt.sign(
    { userId },
    process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET!,
    options
  );
};

export const generateRefreshToken = (userId: string): string => {
  const options: SignOptions = {
    expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d'
  };
  return jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET!,
    options
  );
};

export const verifyRefreshToken = (token: string): { userId: string } => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as { userId: string };
};

