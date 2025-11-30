import jwt from 'jsonwebtoken';

export const generateAccessToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET!,
    { expiresIn: '15m' }
  );
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: '7d' }
  );
};

export const verifyRefreshToken = (token: string): { userId: string } => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as { userId: string };
};

