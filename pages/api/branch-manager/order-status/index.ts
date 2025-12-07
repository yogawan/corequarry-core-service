// @/pages/api/branch-manager/order-status/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Transaction from "@/models/Transaction";
import { mongoConnect } from "@/lib/mongoConnect";
import { enableCors } from "@/middleware/enableCors";
import { verifyAuth } from "@/middleware/verifyAuth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await mongoConnect();

  switch (req.method) {
    case "PATCH":
      try {
        const { orderId, orderStatus } = req.body;

        // Validasi input
        if (!orderId || !orderStatus) {
          return res.status(400).json({
            success: false,
            message: "Order ID and order status are required",
          });
        }

        // Validasi orderStatus enum
        const validStatuses = [
          "diproses",
          "sedang_loading",
          "dalam_perjalanan",
          "tiba_di_tujuan",
          "sedang_dibongkar",
          "selesai",
        ];

        if (!validStatuses.includes(orderStatus)) {
          return res.status(400).json({
            success: false,
            message: `Invalid order status. Valid statuses: ${validStatuses.join(", ")}`,
          });
        }

        // Cari transaksi
        const transaction = await Transaction.findOne({ orderId })
          .populate("customerId")
          .populate("productId");
        
        if (!transaction) {
          return res.status(404).json({
            success: false,
            message: "Transaction not found",
          });
        }

        // Update order status
        transaction.orderStatus = orderStatus;
        await transaction.save();

        return res.status(200).json({
          success: true,
          message: "Order status updated successfully",
          data: transaction,
        });
      } catch (err: any) {
        console.error("Error updating order status:", err);
        return res.status(500).json({
          success: false,
          message: err.message || "Internal server error",
        });
      }

    case "GET":
      try {
        const { orderStatus, paymentStatus } = req.query;

        // Build query
        const query: any = {};
        if (orderStatus) query.orderStatus = orderStatus;
        if (paymentStatus) query.paymentStatus = paymentStatus;

        // Get all transactions with filters
        const transactions = await Transaction.find(query)
          .populate("customerId")
          .populate("productId")
          .sort({ createdAt: -1 });

        return res.status(200).json({
          success: true,
          data: transactions,
        });
      } catch (err: any) {
        console.error("Error fetching transactions:", err);
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
