// @/pages/api/branch-manager/order-customer/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Transaction from "@/models/Transaction";
import { mongoConnect } from "@/lib/mongoConnect";
import { enableCors } from "@/middleware/enableCors";
import { verifyAuth } from "@/middleware/verifyAuth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await mongoConnect();

  switch (req.method) {
    case "GET":
      try {
        const { orderStatus, paymentStatus, customerId, page = 1, limit = 10 } = req.query;

        // Build query
        const query: any = {};
        if (orderStatus) query.orderStatus = orderStatus;
        if (paymentStatus) query.paymentStatus = paymentStatus;
        if (customerId) query.customerId = customerId;

        // Pagination
        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        // Get total count
        const total = await Transaction.countDocuments(query);

        // Get transactions with pagination
        const transactions = await Transaction.find(query)
          .populate("customerId", "nama email noTelepon")
          .populate("productId", "nama kodeSku hargaJual satuan")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limitNum);

        return res.status(200).json({
          success: true,
          data: transactions,
          pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
          },
        });
      } catch (err: any) {
        console.error("Error fetching customer orders:", err);
        return res.status(500).json({
          success: false,
          message: err.message || "Internal server error",
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
