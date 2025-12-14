// @/pages/api/branch/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { mongoConnect } from "@/lib/mongoConnect";
import Branch from "@/models/Branch";
import { enableCors } from "@/middleware/enableCors";
import { verifyAuth } from "@/middleware/verifyAuth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await mongoConnect();
  const { id } = req.query;

  switch (req.method) {
    case "GET":
      try {
        const branch = await Branch.findById(id);
        if (!branch)
          return res.status(404).json({ success: false, message: "Branch not found" });

        return res.status(200).json({ success: true, data: branch });
      } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
      }

    case "PUT":
      try {
        const updated = await Branch.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });

        if (!updated)
          return res.status(404).json({ success: false, message: "Branch not found" });

        return res.status(200).json({ success: true, data: updated });
      } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
      }

    case "DELETE":
      try {
        const deleted = await Branch.findByIdAndDelete(id);
        if (!deleted)
          return res.status(404).json({ success: false, message: "Branch not found" });

        return res.status(200).json({ success: true, message: "Branch deleted successfully" });
      } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
      }

    default:
      return res.status(405).json({
        success: false,
        message: "Method Not Allowed",
      });
  }
}

export default enableCors(verifyAuth(handler));