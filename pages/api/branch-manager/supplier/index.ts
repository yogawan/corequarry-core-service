// @/pages/api/branch-manager/supplier/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Supplier from "@/models/Supplier";
import { mongoConnect } from "@/lib/mongoConnect";
import { enableCors } from "@/middleware/enableCors";
import { verifyAuth } from "@/middleware/verifyAuth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await mongoConnect();

  switch (req.method) {
    case "GET":
      try {
        const { isActive, namaPerusahaan } = req.query;
        let query: any = {};
        if (isActive !== undefined) {
          query.isActive = isActive === "true";
        }
        if (namaPerusahaan) {
          query.namaPerusahaan = { $regex: namaPerusahaan, $options: "i" };
        }
        const suppliers = await Supplier.find(query).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: suppliers });
      } catch (err: any) {
        return res.status(500).json({ success: false, message: err.message });
      }

    case "POST":
      try {
        const { namaPerusahaan } = req.body;
        if (!namaPerusahaan) {
          return res.status(400).json({ success: false, message: "Nama perusahaan is required" });
        }
        const supplier = await Supplier.create(req.body);
        return res.status(201).json({ success: true, data: supplier });
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