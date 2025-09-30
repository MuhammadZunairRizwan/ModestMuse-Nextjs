import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { User } from './db/db';

const JWT_SECRET = process.env.JWT_SECRET || '';
console.log("JWT_SECRET in verifyToken:", JWT_SECRET);


export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = async (user: User): Promise<string> => {
  const payload = {
    id: user.id,
    email: user.email,
    user_type: user.user_type,
    is_verified: user.is_verified
  };
  
  const secret = new TextEncoder().encode(JWT_SECRET);
  
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(secret);
};

export const verifyToken = async (token: string): Promise<any> => {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
