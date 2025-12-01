import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "@/lib/auth";

export const verifyAuth = (handler: Function) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }

    const token = authHeader.substring(7); // Remove "Bearer "
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
    }

    // Attach user info to req
    (req as any).user = decoded;

    return handler(req, res);
  };
};