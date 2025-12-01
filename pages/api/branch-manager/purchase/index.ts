// @/pages/api/branch-manager/purchase/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Purchase from "@/models/Purchase";
import { mongoConnect } from "@/lib/mongoConnect";
import { enableCors } from "@/middleware/enableCors";
import { verifyAuth } from "@/middleware/verifyAuth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await mongoConnect();

  switch (req.method) {
    case "GET":
      try {
        const purchases = await Purchase.find({}).populate('supplierId').sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: purchases });
      } catch (err: any) {
        return res.status(500).json({ success: false, message: err.message });
      }

    case "POST":
      try {
        const { supplierId, namaMaterial, unit, hargaPerUnit, jumlah } = req.body;
        if (!supplierId || !namaMaterial || !hargaPerUnit || !jumlah) {
          return res.status(400).json({ success: false, message: "supplierId, namaMaterial, hargaPerUnit, and jumlah are required" });
        }
        const purchase = await Purchase.create(req.body);
        return res.status(201).json({ success: true, data: purchase });
      } catch (err: any) {
        return res.status(400).json({ success: false, message: err.message });
      }

    default:
      return res
        .status(405)
        .json({ success: false, message: "Method Not Allowed" });
  }
}

export default enableCors(verifyAuth(handler));