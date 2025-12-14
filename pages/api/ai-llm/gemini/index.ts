// @/pages/api/ai-llm/gemini/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { GoogleGenAI } from "@google/genai";
import { mongoConnect } from "@/lib/mongoConnect";
import { enableCors } from "@/middleware/enableCors";
import { verifyAuth } from "@/middleware/verifyAuth";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await mongoConnect();

    // User info sudah di-attach oleh verifyAuth
    const user = (req as any).user;

    if (user.role !== "owner" && user.role !== "branch-manager") {
      return res.status(403).json({ message: "Akses ditolak" });
    }

    const { askToMekarJSLLM } = req.body;

    if (!askToMekarJSLLM || typeof askToMekarJSLLM !== "string") {
      return res.status(400).json({ message: "Pertanyaan wajib diisi" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: askToMekarJSLLM,
    });

    const answer = response.text || "Maaf, tidak dapat menghasilkan jawaban.";

    return res.status(200).json({
      status: "Sukses bertanya pada AI LLM MekarJS",
      responseMekarJSLLM: answer,
    });
  } catch (err: any) {
    console.error("AI LLM error:", err);

    // Handle rate limit errors
    if (err.status === 429) {
      return res.status(429).json({
        message: "Kuota API Gemini telah habis. Silakan cek billing atau tunggu beberapa saat.",
        error: "RATE_LIMIT_EXCEEDED"
      });
    }

    // Handle other API errors
    if (err.status) {
      return res.status(err.status).json({
        message: `Gemini API error: ${err.message || "Unknown error"}`,
        error: "API_ERROR"
      });
    }

    return res.status(500).json({
      message: "Server error",
      error: "INTERNAL_ERROR"
    });
  }
}

export default enableCors(verifyAuth(handler));
