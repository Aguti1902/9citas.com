import jwt from 'jsonwebtoken';

export const generateAccessToken = (userId: string): string => {
  const secret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_ACCESS_SECRET o JWT_SECRET no está configurado');
  }
  return jwt.sign(
    { userId },
    secret,
    { expiresIn: '7d' } // Cambiado a 7 días para que la sesión persista
  );
};

export const generateRefreshToken = (userId: string): string => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET no está configurado');
  }
  return jwt.sign(
    { userId },
    secret,
    { expiresIn: '7d' }
  );
};

export const verifyRefreshToken = (token: string): { userId: string } => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as { userId: string };
};

