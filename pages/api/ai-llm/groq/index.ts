// @/pages/api/ai-llm/groq/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Groq from "groq-sdk";
import { mongoConnect } from "@/lib/mongoConnect";
import { enableCors } from "@/middleware/enableCors";
import { verifyAuth } from "@/middleware/verifyAuth";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function handler(req: NextApiRequest, res: NextApiResponse) {
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

    const { askToMekarJSLLM } = req.body;

    if (!askToMekarJSLLM || typeof askToMekarJSLLM !== "string") {
      return res.status(400).json({ message: "Pertanyaan wajib diisi" });
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        {
          role: "user",
          content: askToMekarJSLLM,
        },
      ],
      model: "llama-3.1-8b-instant",
    });

    const answer =
      chatCompletion.choices[0]?.message?.content ||
      "Maaf, tidak dapat menghasilkan jawaban.";

    return res.status(200).json({
      status: "Sukses bertanya pada AI LLM MekarJS",
      responseMekarJSLLM: answer,
    });
  } catch (err) {
    console.error("AI LLM error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export default enableCors(verifyAuth(handler));
