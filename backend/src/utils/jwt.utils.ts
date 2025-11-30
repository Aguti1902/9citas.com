import jwt from 'jsonwebtoken';

export const generateAccessToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    process.env.JWT_ACCESS_SECRET!,
    { expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m' }
  );
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d' }
  );
};

export const verifyRefreshToken = (token: string): { userId: string } => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as { userId: string };
};

