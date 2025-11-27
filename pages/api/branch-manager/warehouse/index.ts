// @/pages/api/warehouse/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Warehouse from "@/models/Warehouse";
import { mongoConnect } from "@/lib/mongoConnect";
import { enableCors } from "@/middleware/enableCors";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await mongoConnect();

  switch (req.method) {
    case "GET":
      try {
        const gudang = await Warehouse.find();
        return res.status(200).json({ success: true, data: gudang });
      } catch (err: any) {
        return res.status(500).json({ success: false, message: err.message });
      }

    case "POST":
      try {
        const data = await Warehouse.create(req.body);
        return res.status(201).json({ success: true, data });
      } catch (err: any) {
        return res.status(400).json({ success: false, message: err.message });
      }

    default:
      return res
        .status(405)
        .json({ success: false, message: "Method Not Allowed" });
  }
}

export default enableCors(handler);
