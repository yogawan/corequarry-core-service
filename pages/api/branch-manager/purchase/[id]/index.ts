// @/pages/api/branch-manager/purchase/[id]/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Purchase from "@/models/Purchase";
import { mongoConnect } from "@/lib/mongoConnect";
import { enableCors } from "@/middleware/enableCors";
import { verifyAuth } from "@/middleware/verifyAuth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await mongoConnect();
  const { id } = req.query;

  switch (req.method) {
    case "GET":
      try {
        const purchase = await Purchase.findById(id).populate('supplierId');
        if (!purchase)
          return res
            .status(404)
            .json({ success: false, message: "Purchase not found" });
        return res.status(200).json({ success: true, data: purchase });
      } catch (err: any) {
        return res.status(400).json({ success: false, message: err.message });
      }

    case "PUT":
      try {
        const purchase = await Purchase.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!purchase)
          return res
            .status(404)
            .json({ success: false, message: "Purchase not found" });
        return res.status(200).json({ success: true, data: purchase });
      } catch (err: any) {
        return res.status(400).json({ success: false, message: err.message });
      }

    case "DELETE":
      try {
        const deleted = await Purchase.findByIdAndDelete(id);
        if (!deleted)
          return res
            .status(404)
            .json({ success: false, message: "Purchase not found" });
        return res
          .status(200)
          .json({ success: true, message: "Purchase deleted successfully" });
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