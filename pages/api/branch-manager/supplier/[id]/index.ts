// @/pages/api/branch-manager/supplier/[id]/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Supplier from "@/models/Supplier";
import { mongoConnect } from "@/lib/mongoConnect";
import { enableCors } from "@/middleware/enableCors";
import { verifyAuth } from "@/middleware/verifyAuth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await mongoConnect();
  const { id } = req.query;

  switch (req.method) {
    case "GET":
      try {
        const supplier = await Supplier.findById(id);
        if (!supplier)
          return res
            .status(404)
            .json({ success: false, message: "Supplier not found" });
        return res.status(200).json({ success: true, data: supplier });
      } catch (err: any) {
        return res.status(400).json({ success: false, message: err.message });
      }

    case "PUT":
      try {
        const supplier = await Supplier.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!supplier)
          return res
            .status(404)
            .json({ success: false, message: "Supplier not found" });
        return res.status(200).json({ success: true, data: supplier });
      } catch (err: any) {
        return res.status(400).json({ success: false, message: err.message });
      }

    case "DELETE":
      try {
        const deleted = await Supplier.findByIdAndDelete(id);
        if (!deleted)
          return res
            .status(404)
            .json({ success: false, message: "Supplier not found" });
        return res
          .status(200)
          .json({ success: true, message: "Supplier deleted successfully" });
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