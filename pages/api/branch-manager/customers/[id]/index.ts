// @/pages/api/branch-manager/customers/[id]/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Customer from "@/models/Customer";
import { mongoConnect } from "@/lib/mongoConnect";
import { enableCors } from "@/middleware/enableCors";
import { verifyAuth } from "@/middleware/verifyAuth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await mongoConnect();
  const { id } = req.query;

  switch (req.method) {
    case "GET":
      try {
        const customer = await Customer.findById(id).select("-password");
        if (!customer)
          return res
            .status(404)
            .json({ success: false, message: "Customer not found" });
        return res.status(200).json({ success: true, data: customer });
      } catch (err: any) {
        return res.status(400).json({ success: false, message: err.message });
      }

    case "DELETE":
      try {
        const deleted = await Customer.findByIdAndDelete(id);
        if (!deleted)
          return res
            .status(404)
            .json({ success: false, message: "Customer not found" });
        return res
          .status(200)
          .json({ success: true, message: "Customer deleted successfully" });
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