// @/pages/api/branch-manager/employee/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import "@/models/Branch";
import Employee from "@/models/Employee";
import { mongoConnect } from "@/lib/mongoConnect";
import { enableCors } from "@/middleware/enableCors";

async function handler(req: NextApiRequest, res: NextApiResponse) {
    await mongoConnect();

    switch (req.method) {
        case "GET":
            try {
                const { cabangId } = req.query;
                const query = cabangId ? { cabangId } : {};
                const employees = await Employee.find(query)
                    .populate('cabangId', 'namaCabang kodeCabang')
                    .sort({ createdAt: -1 });
                return res.status(200).json({ success: true, data: employees });
            } catch (err: any) {
                return res.status(500).json({ success: false, message: err.message });
            }

        case "POST":
            try {
                const { cabangId, nama, email } = req.body;
                if (!cabangId || !nama || !email) {
                    return res.status(400).json({
                        success: false,
                        message: "cabangId, nama, and email are required"
                    });
                }

                // Check if email already exists
                const existingEmployee = await Employee.findOne({ email });
                if (existingEmployee) {
                    return res.status(400).json({
                        success: false,
                        message: "Employee with this email already exists"
                    });
                }

                const employee = await Employee.create(req.body);
                const populatedEmployee = await Employee.findById(employee._id)
                    .populate('cabangId', 'namaCabang kodeCabang');
                return res.status(201).json({ success: true, data: populatedEmployee });
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
