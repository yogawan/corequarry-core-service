// @/pages/api/branch-manager/sale/[id]/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Sale from "@/models/Sale";
import { mongoConnect } from "@/lib/mongoConnect";
import { enableCors } from "@/middleware/enableCors";
import { verifyAuth } from "@/middleware/verifyAuth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await mongoConnect();
  const { id } = req.query;

  switch (req.method) {
    case "GET":
      try {
        const sale = await Sale.findById(id)
          .populate('customerId', 'nama email')
          .populate('productId', 'nama kodeSku');
        if (!sale)
          return res
            .status(404)
            .json({ success: false, message: "Sale not found" });
        return res.status(200).json({ success: true, data: sale });
      } catch (err: any) {
        return res.status(400).json({ success: false, message: err.message });
      }

    case "PUT":
      try {
        const sale = await Sale.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!sale)
          return res
            .status(404)
            .json({ success: false, message: "Sale not found" });
        const populatedSale = await Sale.findById(sale._id)
          .populate('customerId', 'nama email')
          .populate('productId', 'nama kodeSku');
        return res.status(200).json({ success: true, data: populatedSale });
      } catch (err: any) {
        return res.status(400).json({ success: false, message: err.message });
      }

    case "DELETE":
      try {
        const deleted = await Sale.findByIdAndDelete(id);
        if (!deleted)
          return res
            .status(404)
            .json({ success: false, message: "Sale not found" });
        return res
          .status(200)
          .json({ success: true, message: "Sale deleted successfully" });
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