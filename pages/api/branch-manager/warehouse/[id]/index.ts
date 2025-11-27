// @/pages/api/warehouse/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import Warehouse from "@/models/Warehouse";
import { mongoConnect } from "@/lib/mongoConnect";
import { enableCors } from "@/middleware/enableCors";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await mongoConnect();
  const { id } = req.query;

  switch (req.method) {
    case "GET":
      try {
        const gudang = await Warehouse.findById(id);
        if (!gudang)
          return res
            .status(404)
            .json({ success: false, message: "Warehouse not found" });

        return res.status(200).json({ success: true, data: gudang });
      } catch (err: any) {
        return res.status(400).json({ success: false, message: err.message });
      }

    case "PUT":
      try {
        const update = await Warehouse.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });

        if (!update)
          return res
            .status(404)
            .json({ success: false, message: "Warehouse not found" });

        return res.status(200).json({ success: true, data: update });
      } catch (err: any) {
        return res.status(400).json({ success: false, message: err.message });
      }

    case "DELETE":
      try {
        const deleted = await Warehouse.findByIdAndDelete(id);

        if (!deleted)
          return res
            .status(404)
            .json({ success: false, message: "Warehouse not found" });

        return res
          .status(200)
          .json({ success: true, message: "Warehouse deleted successfully" });
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
