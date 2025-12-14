// @/pages/api/branch-manager/product/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import "@/models/Branch"
import Product from "@/models/Product";
import { mongoConnect } from "@/lib/mongoConnect";
import { enableCors } from "@/middleware/enableCors";
import { verifyAuth } from "@/middleware/verifyAuth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await mongoConnect();

  switch (req.method) {
    case "GET":
      try {
        const { cabangId } = req.query;
        const query = cabangId ? { cabangId } : {};
        const products = await Product.find(query).populate('cabangId');
        return res.status(200).json({ success: true, data: products });
      } catch (err: any) {
        return res.status(500).json({ success: false, message: err.message });
      }

    case "POST":
      try {
        const { cabangId, kodeSku } = req.body;
        if (!cabangId || !kodeSku) {
          return res.status(400).json({ success: false, message: "cabangId and kodeSku are required" });
        }
        const existingProduct = await Product.findOne({ cabangId, kodeSku });
        if (existingProduct) {
          return res.status(400).json({ success: false, message: "Product with this kodeSku already exists in this branch" });
        }
        const product = await Product.create(req.body);
        return res.status(201).json({ success: true, data: product });
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
