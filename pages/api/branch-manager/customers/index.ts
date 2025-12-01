// @/pages/api/branch-manager/customers/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Customer from "@/models/Customer";
import { mongoConnect } from "@/lib/mongoConnect";
import { enableCors } from "@/middleware/enableCors";
import { verifyAuth } from "@/middleware/verifyAuth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await mongoConnect();

  switch (req.method) {
    case "GET":
      try {
        const { isActive, nama } = req.query;
        let query: any = {};
        if (isActive !== undefined) {
          query.isActive = isActive === "true";
        }
        if (nama) {
          query.nama = { $regex: nama, $options: "i" };
        }
        const customers = await Customer.find(query).select("-password").sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: customers });
      } catch (err: any) {
        return res.status(500).json({ success: false, message: err.message });
      }

    default:
      return res
        .status(405)
        .json({ success: false, message: "Method Not Allowed" });
  }
}

export default enableCors(verifyAuth(handler));