// @/pages/api/branch-manager/order-customer/[id]/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Transaction from "@/models/Transaction";
import { mongoConnect } from "@/lib/mongoConnect";
import { enableCors } from "@/middleware/enableCors";
import { verifyAuth } from "@/middleware/verifyAuth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await mongoConnect();

  const { id } = req.query;

  switch (req.method) {
    case "GET":
      try {
        // Get transaction by ID (MongoDB _id or orderId)
        let transaction = await Transaction.findById(id)
          .populate("customerId", "nama email noTelepon alamat")
          .populate("productId", "nama kodeSku hargaJual satuan deskripsi");

        // If not found by _id, try finding by orderId
        if (!transaction) {
          transaction = await Transaction.findOne({ orderId: id })
            .populate("customerId", "nama email noTelepon alamat")
            .populate("productId", "nama kodeSku hargaJual satuan deskripsi");
        }

        if (!transaction) {
          return res.status(404).json({
            success: false,
            message: "Transaction not found",
          });
        }

        return res.status(200).json({
          success: true,
          data: transaction,
        });
      } catch (err: any) {
        console.error("Error fetching transaction detail:", err);
        return res.status(500).json({
          success: false,
          message: err.message || "Internal server error",
        });
      }

    case "PATCH":
      try {
        const { orderStatus } = req.body;

        // Validasi orderStatus enum
        const validStatuses = [
          "diproses",
          "sedang_loading",
          "dalam_perjalanan",
          "tiba_di_tujuan",
          "sedang_dibongkar",
          "selesai",
        ];

        if (orderStatus && !validStatuses.includes(orderStatus)) {
          return res.status(400).json({
            success: false,
            message: `Invalid order status. Valid statuses: ${validStatuses.join(", ")}`,
          });
        }

        // Find transaction by ID or orderId
        let transaction = await Transaction.findById(id);
        
        if (!transaction) {
          transaction = await Transaction.findOne({ orderId: id });
        }

        if (!transaction) {
          return res.status(404).json({
            success: false,
            message: "Transaction not found",
          });
        }

        // Update order status
        if (orderStatus) {
          transaction.orderStatus = orderStatus;
        }

        await transaction.save();

        // Populate for response
        await transaction.populate("customerId", "nama email noTelepon alamat");
        await transaction.populate("productId", "nama kodeSku hargaJual satuan deskripsi");

        return res.status(200).json({
          success: true,
          message: "Order status updated successfully",
          data: transaction,
        });
      } catch (err: any) {
        console.error("Error updating transaction:", err);
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
