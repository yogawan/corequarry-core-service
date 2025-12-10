// @/pages/api/branch-manager/employee/[id]/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import "@/models/Branch";
import Employee from "@/models/Employee";
import { mongoConnect } from "@/lib/mongoConnect";
import { enableCors } from "@/middleware/enableCors";

async function handler(req: NextApiRequest, res: NextApiResponse) {
    await mongoConnect();
    const { id } = req.query;

    switch (req.method) {
        case "GET":
            try {
                const employee = await Employee.findById(id)
                    .populate('cabangId', 'namaCabang kodeCabang alamat');
                if (!employee)
                    return res
                        .status(404)
                        .json({ success: false, message: "Employee not found" });
                return res.status(200).json({ success: true, data: employee });
            } catch (err: any) {
                return res.status(400).json({ success: false, message: err.message });
            }

        case "PUT":
            try {
                // If email is being updated, check for uniqueness
                if (req.body.email) {
                    const existingEmployee = await Employee.findOne({
                        email: req.body.email,
                        _id: { $ne: id } // Exclude current employee
                    });
                    if (existingEmployee) {
                        return res.status(400).json({
                            success: false,
                            message: "Employee with this email already exists"
                        });
                    }
                }

                const employee = await Employee.findByIdAndUpdate(id, req.body, {
                    new: true,
                    runValidators: true,
                }).populate('cabangId', 'namaCabang kodeCabang alamat');

                if (!employee)
                    return res
                        .status(404)
                        .json({ success: false, message: "Employee not found" });
                return res.status(200).json({ success: true, data: employee });
            } catch (err: any) {
                return res.status(400).json({ success: false, message: err.message });
            }

        case "DELETE":
            try {
                const deleted = await Employee.findByIdAndDelete(id);
                if (!deleted)
                    return res
                        .status(404)
                        .json({ success: false, message: "Employee not found" });
                return res
                    .status(200)
                    .json({ success: true, message: "Employee deleted successfully" });
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
