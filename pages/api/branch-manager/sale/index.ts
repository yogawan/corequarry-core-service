// @/pages/api/branch-manager/sale/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Sale from "@/models/Sale";
import { mongoConnect } from "@/lib/mongoConnect";
import { enableCors } from "@/middleware/enableCors";
import { verifyAuth } from "@/middleware/verifyAuth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await mongoConnect();

  switch (req.method) {
    case "GET":
      try {
        const sales = await Sale.find({})
          .populate('customerId', 'nama email')
          .populate('productId', 'nama kodeSku')
          .sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: sales });
      } catch (err: any) {
        return res.status(500).json({ success: false, message: err.message });
      }

    case "POST":
      try {
        const { customerId, productId, jumlah } = req.body;
        if (!customerId || !productId || !jumlah) {
          return res.status(400).json({ success: false, message: "customerId, productId, and jumlah are required" });
        }
        const sale = await Sale.create(req.body);
        const populatedSale = await Sale.findById(sale._id)
          .populate('customerId', 'nama email')
          .populate('productId', 'nama kodeSku');
        return res.status(201).json({ success: true, data: populatedSale });
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