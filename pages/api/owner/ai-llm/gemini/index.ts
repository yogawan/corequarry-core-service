// @/pages/api/owner/ai-llm/gemini/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { mongoConnect } from "@/lib/mongoConnect";
import { enableCors } from "@/middleware/enableCors";
import { verifyAuth } from "@/middleware/verifyAuth";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await mongoConnect();

    // User info sudah di-attach oleh verifyAuth
    const user = (req as any).user;

    if (user.role !== "owner") {
      return res.status(403).json({ message: "Akses ditolak" });
    }

    const { askToCoreQuarry } = req.body;

    if (!askToCoreQuarry || typeof askToCoreQuarry !== "string") {
      return res.status(400).json({ message: "Pertanyaan wajib diisi" });
    }

    // TODO: Implement Gemini API integration
    return res.status(501).json({
      message: "Gemini API belum diimplementasikan",
    });
  } catch (err) {
    console.error("Gemini AI error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export default enableCors(verifyAuth(handler));
