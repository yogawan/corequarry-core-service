// @/pages/api/auth/owner/login/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Owner from "@/models/Owner";
import { mongoConnect } from "@/lib/mongoConnect";
import { comparePassword, generateToken } from "@/lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await mongoConnect();

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email & password wajib diisi" });
    }

    const owner = await Owner.findOne({ email });
    if (!owner) {
      return res.status(404).json({ message: "Akun tidak ditemukan" });
    }

    const isMatch = await comparePassword(password, owner.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password salah" });
    }

    const token = generateToken({
      id: owner._id,
      role: "owner",
    });

    return res.status(200).json({
      message: "Login berhasil",
      token,
      owner,
    });
  } catch (err) {
    console.error("Owner Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
