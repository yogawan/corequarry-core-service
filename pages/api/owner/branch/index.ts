// @/pages/api/branch/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { mongoConnect } from "@/lib/mongoConnect";
import Branch from "@/models/Branch";
import { enableCors } from "@/middleware/enableCors";
import { verifyAuth } from "@/middleware/verifyAuth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await mongoConnect();

  switch (req.method) {
    case "GET":
      try {
        const branches = await Branch.find().sort({ createdAt: -1 });
        return res.status(200).json({
          success: true,
          data: branches,
        });
      } catch (error: any) {
        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }

    case "POST":
      try {
        const branch = await Branch.create(req.body);
        return res.status(201).json({
          success: true,
          data: branch,
        });
      } catch (error: any) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

    default:
      return res.status(405).json({
        success: false,
        message: "Method Not Allowed",
      });
  }
}

export default enableCors(verifyAuth(handler));