import mongoose, { Document, Schema } from "mongoose";

export interface IEmployee extends Document {
    cabangId: mongoose.Types.ObjectId;
    nama: string;
    email: string;
    telepon?: string;
    alamat?: string;
    gaji?: number;
    tanggalMasuk: Date;
    status: "aktif" | "nonaktif";
    createdAt: Date;
    updatedAt: Date;
}

const EmployeeSchema = new Schema<IEmployee>(
    {
        cabangId: {
            type: Schema.Types.ObjectId,
            ref: "Branch", // relasi ke model Branch
            required: true,
        },
        nama: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        telepon: {
            type: String,
            default: "",
        },
        alamat: {
            type: String,
            default: "",
        },
        gaji: {
            type: Number,
            default: 0,
        },
        tanggalMasuk: {
            type: Date,
            default: Date.now,
        },
        status: {
            type: String,
            enum: ["aktif", "nonaktif"],
            default: "aktif",
        },
    },
    { timestamps: true }
);

// Model tetap bernama Employee agar konsisten
const Employee =
    mongoose.models.Employee || mongoose.model<IEmployee>("Employee", EmployeeSchema);

export default Employee;
