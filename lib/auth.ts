import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const hashPassword = async (plain: string) => {
  return await bcrypt.hash(plain, 12);
};

export const comparePassword = async (plain: string, hash: string) => {
  return await bcrypt.compare(plain, hash);
};

export const generateToken = (payload: object) => {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "7d" });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch (error) {
    return null;
  }
};
