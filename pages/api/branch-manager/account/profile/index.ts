// @/pages/api/branch-manager/account/profile/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import BranchManager from "@/models/BranchManager";
import Branch from "@/models/Branch";
import { mongoConnect } from "@/lib/mongoConnect";
import { enableCors } from "@/middleware/enableCors";
import { verifyAuth } from "@/middleware/verifyAuth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await mongoConnect();

    // User info sudah di-attach oleh verifyAuth
    const user = (req as any).user;

    if (user.role !== "branch-manager") {
      return res.status(403).json({ message: "Akses ditolak" });
    }

    const branchManager = await BranchManager.findById(user.id).select(
      "-password",
    );
    if (!branchManager) {
      return res
        .status(404)
        .json({ message: "Branch Manager tidak ditemukan" });
    }

    const branch = await Branch.findById(branchManager.cabangId);

    return res.status(200).json({
      message: "Profile berhasil diambil",
      branchManager: {
        ...branchManager.toObject(),
        cabangId: branch,
      },
    });
  } catch (err) {
    console.error("Branch Manager Profile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export default enableCors(verifyAuth(handler));
