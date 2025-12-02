import type { NextApiRequest, NextApiResponse } from "next";
import BranchManager from "@/models/BranchManager";
import Branch from "@/models/Branch";
import { mongoConnect } from "@/lib/mongoConnect";
import { comparePassword, generateToken } from "@/lib/auth";
import { enableCors } from "@/middleware/enableCors";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await mongoConnect();

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email & password wajib diisi" });
    }

    // Cari manager
    const manager = (await BranchManager.findOne({ email }).lean()) as any;
    if (!manager) {
      return res.status(404).json({ message: "Akun tidak ditemukan" });
    }

    // Cek password
    const isMatch = await comparePassword(password, manager.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password salah" });
    }

    // Ambil data cabang
    const branch = await Branch.findById(manager.cabangId).lean();

    // Token JWT
    const token = generateToken({
      id: manager._id,
      role: "branch-manager",
      cabangId: manager.cabangId,
    });

    // Replace cabangId dengan data branch penuh
    const managerWithBranch = {
      ...manager,
      cabangId: branch || null,
    };

    return res.status(200).json({
      message: "Login berhasil",
      token,
      branchManager: managerWithBranch,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export default enableCors(handler);
