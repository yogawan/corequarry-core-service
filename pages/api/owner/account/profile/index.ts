// @/pages/api/owner/account/profile/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Owner from "@/models/Owner";
import { mongoConnect } from "@/lib/mongoConnect";
import { enableCors } from "@/middleware/enableCors";
import { verifyAuth } from "@/middleware/verifyAuth";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await mongoConnect();

    // User info sudah di-attach oleh verifyAuth
    const user = (req as any).user;

    if (user.role !== "owner") {
      return res.status(403).json({ message: "Akses ditolak" });
    }

    const owner = await Owner.findById(user.id).select("-password");
    if (!owner) {
      return res.status(404).json({ message: "Owner tidak ditemukan" });
    }

    return res.status(200).json({
      message: "Profile berhasil diambil",
      owner,
    });
  } catch (err) {
    console.error("Owner Profile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export default enableCors(verifyAuth(handler));